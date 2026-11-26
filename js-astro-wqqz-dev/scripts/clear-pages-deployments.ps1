#Requires -Version 5.1
<#
  Clear GitHub Pages deployment history for example/example-portfolio.
  Usage:  $env:GITHUB_TOKEN = "ghp_..." ; ./scripts/clear-pages-deployments.ps1
  Token:  classic PAT with repo scope
#>

if (-not $env:GITHUB_TOKEN) {
    Write-Error "Set GITHUB_TOKEN first (classic PAT, scope: repo)."
    exit 1
}

$repo  = "example/example-portfolio"
$api   = "https://api.github.com/repos/$repo"
$headers = @{
    Authorization = "Bearer $env:GITHUB_TOKEN"
    'User-Agent'  = 'example-portfolio-cleanup'
    Accept        = 'application/vnd.github+json'
}

$deployments = @()
$page = 1
do {
    $r = Invoke-RestMethod -Uri "$api/deployments?per_page=100&page=$page" -Headers $headers
    $deployments += $r
    $page++
} while ($r.Count -eq 100)

"Found $($deployments.Count) deployment record(s)"

foreach ($d in $deployments) {
    $id = $d.id
    try {
        Invoke-RestMethod -Method Post -Uri "$api/deployments/$id/statuses" `
            -Headers $headers -ContentType 'application/json' `
            -Body '{"state":"inactive","description":"clearing history"}' | Out-Null
    } catch { Write-Warning "mark inactive $id : $($_.Exception.Message)" }

    try {
        Invoke-WebRequest -Method Delete -Uri "$api/deployments/$id" -Headers $headers | Out-Null
        "deleted deployment $id"
    } catch { Write-Warning "delete $id : $($_.Exception.Message)" }
}

foreach ($envName in @('Production', 'github-pages')) {
    try {
        Invoke-WebRequest -Method Delete -Uri "$api/environments/$envName" -Headers $headers | Out-Null
        "deleted environment $envName"
    } catch { "environment $envName : $($_.Exception.Message)" }
}

$remaining = (Invoke-RestMethod -Uri "$api/deployments?per_page=100" -Headers $headers).Count
"Remaining deployment records: $remaining"