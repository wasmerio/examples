<?php
declare(strict_types=1);
// WASIX PHP lacks dns_get_record. FreshRSS uses only A/AAAA address lookups.
// Return IPv4 records from the native resolver; IPv6-only DNS feeds fail closed.
// FreshRSS still filters every address and pins cURL to the approved addresses.
if (!function_exists('dns_get_record')) {
    defined('DNS_A') || define('DNS_A', 1);
    defined('DNS_AAAA') || define('DNS_AAAA', 134217728);
    function dns_get_record(string $hostname, int $type = 1): array|false {
        if (($type & DNS_A) === 0 || ($type & ~(DNS_A | DNS_AAAA)) !== 0) return false;
        $addresses = gethostbynamel($hostname);
        if ($addresses === false || $addresses === []) return false;
        $records = [];
        foreach (array_unique($addresses) as $address) {
            if (filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) === false) return false;
            $records[] = ['host' => $hostname, 'class' => 'IN', 'type' => 'A', 'ip' => $address];
        }
        return $records;
    }
}
