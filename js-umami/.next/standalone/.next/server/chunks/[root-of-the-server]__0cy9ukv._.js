module.exports=[610104,e=>e.a(async(t,n)=>{try{var r=e.i(81862),i=e.i(843793),a=e.i(698043),s=t([a]);async function d(...e){return(0,i.runQuery)({[i.PRISMA]:()=>u(...e),[i.CLICKHOUSE]:()=>o(...e)})}async function u(e,t,n){let{startDate:r,endDate:i,unit:s="day",timezone:d="utc",currency:u}=t,{getDateSQL:o,rawQuery:_,parseFilters:w}=a.default,{queryParams:c,filterQuery:l,cohortQuery:v,joinSessionQuery:b}=w({...n,websiteId:e,startDate:r,endDate:i,currency:u}),m=l||v?`join (select *
               from website_event
               where website_id = {{websiteId::uuid}}
                  and created_at between {{startDate}} and {{endDate}}
                  and event_type = 2) website_event
        on website_event.website_id = revenue.website_id
          and website_event.session_id = revenue.session_id
          and website_event.event_id = revenue.event_id`:"";return{chart:await _(`
    select
      revenue.event_name x,
      ${o("revenue.created_at",s,d)} t,
      sum(revenue.revenue) y,
      count(revenue.event_id) count
    from revenue
    ${m}
    ${v}
    ${b}
    where revenue.website_id = {{websiteId::uuid}}
      and revenue.created_at between {{startDate}} and {{endDate}}
      and upper(revenue.currency) = {{currency}}
      ${l}
    group by  x, t
    order by t
    `,c)}}async function o(e,t,n){let{startDate:i,endDate:a,unit:s="day",timezone:d="utc",currency:u}=t,{getDateSQL:o,rawQuery:_,parseFilters:w}=r.default,{filterQuery:c,cohortQuery:l,queryParams:v}=w({...n,websiteId:e,startDate:i,endDate:a,currency:u}),b=c?`any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
    on website_event.website_id = website_revenue.website_id
      and website_event.session_id = website_revenue.session_id
      and website_event.event_id = website_revenue.event_id`:"";return{chart:await _(`
    select
      website_revenue.event_name x,
      ${o("website_revenue.created_at",s,d)} t,
      sum(website_revenue.revenue) y,
      count(website_revenue.event_id) count
    from website_revenue
    ${b}
    ${l}
    where website_revenue.website_id = {websiteId:UUID}
      and website_revenue.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      and upper(website_revenue.currency) = {currency:String}
      ${c}
    group by  x, t
    order by t
    `,v)}}[a]=s.then?(await s)():s,e.s(["getRevenueChart",0,d]),n()}catch(e){n(e)}},!1),64633,e=>e.a(async(t,n)=>{try{var r=e.i(81862),i=e.i(843793),a=e.i(698043),s=t([a]);async function d(...e){return(0,i.runQuery)({[i.PRISMA]:()=>u(...e),[i.CLICKHOUSE]:()=>o(...e)})}async function u(e,t,n){let{startDate:r,endDate:i,currency:s}=t,{rawQuery:d,parseFilters:u}=a.default,{queryParams:o,filterQuery:_,cohortQuery:w,joinSessionQuery:c}=u({...n,websiteId:e,startDate:r,endDate:i,currency:s}),l=_||w?`join (select *
               from website_event
               where website_id = {{websiteId::uuid}}
                  and created_at between {{startDate}} and {{endDate}}
                  and event_type = 2) website_event
        on website_event.website_id = revenue.website_id
          and website_event.session_id = revenue.session_id
          and website_event.event_id = revenue.event_id`:"",v=await d(`
    select
      sum(revenue.revenue) as sum,
      count(distinct revenue.event_id) as count,
      count(distinct revenue.session_id) as unique_count,
      (select count(distinct session_id)
       from website_event
       where website_id = {{websiteId::uuid}}
         and created_at between {{startDate}} and {{endDate}}) as total_sessions
    from revenue
    ${l}
    ${w}
    ${c}
    where revenue.website_id = {{websiteId::uuid}}
      and revenue.created_at between {{startDate}} and {{endDate}}
      and upper(revenue.currency) = {{currency}}
      ${_}
  `,o).then(e=>e?.[0]);return v.average=v.count>0?Number(v.sum)/Number(v.count):0,v.arpu=v.total_sessions>0?Number(v.sum)/Number(v.total_sessions):0,v}async function o(e,t,n){let{startDate:i,endDate:a,currency:s}=t,{rawQuery:d,parseFilters:u}=r.default,{filterQuery:o,cohortQuery:_,queryParams:w}=u({...n,websiteId:e,startDate:i,endDate:a,currency:s}),c=o?`any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
    on website_event.website_id = website_revenue.website_id
      and website_event.session_id = website_revenue.session_id
      and website_event.event_id = website_revenue.event_id`:"",l=await d(`
    select
      sum(website_revenue.revenue) as sum,
      uniqExact(website_revenue.event_id) as count,
      uniqExact(website_revenue.session_id) as unique_count,
      (select uniqExact(session_id)
       from website_event
       where website_id = {websiteId:UUID}
         and created_at between {startDate:DateTime64} and {endDate:DateTime64}) as total_sessions
    from website_revenue
    ${c}
    ${_}
    where website_revenue.website_id = {websiteId:UUID}
      and website_revenue.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      and upper(website_revenue.currency) = {currency:String}
      ${o}
    `,w).then(e=>e?.[0]);return l.average=l.count>0?l.sum/l.count:0,l.arpu=l.total_sessions>0?l.sum/l.total_sessions:0,l}[a]=s.then?(await s)():s,e.s(["getRevenueStats",0,d]),n()}catch(e){n(e)}},!1),542502,e=>e.a(async(t,n)=>{try{var r=e.i(81862),i=e.i(869582),a=e.i(843793),s=e.i(698043),d=t([s]);async function u(...e){return(0,a.runQuery)({[a.PRISMA]:()=>o(...e),[a.CLICKHOUSE]:()=>_(...e)})}async function o(e,t,n,r){let{startDate:a,endDate:d,currency:u}=t,{rawQuery:o,parseFilters:_}=s.default,{queryParams:w,filterQuery:l,cohortQuery:v,joinSessionQuery:b}=_({...n,websiteId:e,startDate:a,endDate:d,currency:u}),m=l||v?`join (select *
               from website_event
               where website_id = {{websiteId::uuid}}
                  and created_at between {{startDate}} and {{endDate}}
                  and event_type = 2) website_event
        on website_event.website_id = revenue.website_id
          and website_event.session_id = revenue.session_id
          and website_event.event_id = revenue.event_id`:"";return o("country"===r?`
      select
        session.country as "name",
        sum(revenue) as "value"
      from revenue
      ${m}
      join session
        on session.website_id = revenue.website_id
          and session.session_id = revenue.session_id
      ${v}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${l}
      group by session.country
      order by value desc
      `:"region"===r?`
      select
        session.country,
        session.region as "name",
        sum(revenue.revenue) as "value"
      from revenue
      ${m}
      join session
        on session.website_id = revenue.website_id
          and session.session_id = revenue.session_id
      ${v}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${l}
      group by session.country, session.region
      order by value desc
      `:"referrer"===r?`
      WITH events AS (
        select
          revenue.website_id,
          revenue.session_id,
          sum(revenue.revenue) as "value"
        from revenue
        ${m}
        ${v}
        ${b}
        where revenue.website_id = {{websiteId::uuid}}
          and revenue.created_at between {{startDate}} and {{endDate}}
          and upper(revenue.currency) = {{currency}}
          ${l}
        group by revenue.website_id, revenue.session_id),

      revenue_data AS (
        select
          e.website_id,
          e.session_id,
          e.value,
          we.min_date as created_at
        from events e
        join (
          select session_id, min(created_at) as min_date
          from website_event
          where website_id = {{websiteId::uuid}}
            and created_at between {{startDate}} and {{endDate}}
          group by session_id
        ) we on we.session_id = e.session_id)

      select
        we.referrer_domain as "name",
        sum(revenue_data.value) as "value"
      from revenue_data
      join (
        select website_id, session_id, referrer_domain, created_at
        from website_event
        where website_id = {{websiteId::uuid}}
          and created_at between {{startDate}} and {{endDate}}) we
      on we.website_id = revenue_data.website_id
        and we.session_id = revenue_data.session_id
        and we.created_at = revenue_data.created_at
      group by we.referrer_domain
      order by value desc
      `:`
    WITH events AS (
      select
        revenue.website_id,
        revenue.session_id,
        sum(revenue.revenue) as "value"
      from revenue
      ${m}
      ${v}
      ${b}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${l}
      group by revenue.website_id, revenue.session_id),

    revenue_data AS (
      select
        e.website_id,
        e.session_id,
        e.value,
        we.min_date as created_at
      from events e
      join (
        select session_id, min(created_at) as min_date
        from website_event
        where website_id = {{websiteId::uuid}}
          and created_at between {{startDate}} and {{endDate}}
        group by session_id
      ) we on we.session_id = e.session_id),

    revenue_prefix AS (
      select
        case when we.utm_medium ilike '%cp%' OR
              we.utm_medium ilike '%ppc%' OR
              we.utm_medium ilike '%retargeting%' OR
              we.utm_medium ilike '%paid%' then 'paid' else 'organic' end AS prefix,
        we.referrer_domain,
        we.url_query,
        we.utm_medium,
        we.utm_source,
        we.hostname,
        r.value
      from revenue_data r
      join (
        select website_id, session_id, referrer_domain, url_query, utm_medium, utm_source, hostname, created_at
        from website_event
        where website_id = {{websiteId::uuid}}
          and created_at between {{startDate}} and {{endDate}}) we
      on we.website_id = r.website_id
        and we.session_id = r.session_id
        and we.created_at = r.created_at),

    channels AS (
      select
        case
          when referrer_domain = '' and url_query = '' then 'direct'
          when ${c("url_query",i.PAID_AD_PARAMS)} then 'paidAds'
          when ${c("utm_medium",["referral","app","link"])} then 'referral'
          when utm_medium ilike '%affiliate%' then 'affiliate'
          when utm_medium ilike '%sms%' or utm_source ilike '%sms%' then 'sms'
          when ${c("referrer_domain",i.LLM_DOMAINS)} then 'llm'
          when ${c("referrer_domain",i.SEARCH_DOMAINS)} or utm_medium ilike '%organic%' then concat(prefix, 'Search')
          when ${c("referrer_domain",i.SOCIAL_DOMAINS)} then concat(prefix, 'Social')
          when ${c("referrer_domain",i.EMAIL_DOMAINS)} or utm_medium ilike '%mail%' then 'email'
          when ${c("referrer_domain",i.SHOPPING_DOMAINS)} or utm_medium ilike '%shop%' then concat(prefix, 'Shopping')
          when ${c("referrer_domain",i.VIDEO_DOMAINS)} or utm_medium ilike '%video%' then concat(prefix, 'Video')
          when referrer_domain != regexp_replace(hostname, '^www.', '') and referrer_domain != '' then 'referral'
          else 'Unknown' end AS "name",
        value
      from revenue_prefix)

    select name, sum(value) as value
    from channels
    group by name
    order by value desc
    `,w)}async function _(e,t,n,a){let{startDate:s,endDate:d,currency:u}=t,{rawQuery:o,parseFilters:_}=r.default,{filterQuery:c,cohortQuery:l,queryParams:v}=_({...n,websiteId:e,startDate:s,endDate:d,currency:u}),b=c?`any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
    on website_event.website_id = website_revenue.website_id
      and website_event.session_id = website_revenue.session_id
      and website_event.event_id = website_revenue.event_id`:"";return o("country"===a?`
      select
        website_event.country as "name",
        sum(website_revenue.revenue) as "value"
      from website_revenue
      any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
      on website_event.website_id = website_revenue.website_id
        and website_event.session_id = website_revenue.session_id
        and website_event.event_id = website_revenue.event_id
      ${l}
      where website_revenue.website_id = {websiteId:UUID}
        and website_revenue.created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and upper(website_revenue.currency) = {currency:String}
        ${c}
      group by website_event.country
      order by value desc
      `:"region"===a?`
      select
        website_event.country,
        website_event.region as "name",
        sum(website_revenue.revenue) as "value"
      from website_revenue
      any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
      on website_event.website_id = website_revenue.website_id
        and website_event.session_id = website_revenue.session_id
        and website_event.event_id = website_revenue.event_id
      ${l}
      where website_revenue.website_id = {websiteId:UUID}
        and website_revenue.created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and upper(website_revenue.currency) = {currency:String}
        ${c}
      group by 1,2
      order by value desc
      `:"referrer"===a?`
      WITH events AS (
      select distinct
          website_id,
          session_id,
          sum(revenue) as "value"
      from website_revenue
      ${b}
      ${l}
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and upper(currency) = {currency:String}
        ${c}
      group by 1,2),

      revenue AS (
      select
          e.website_id,
          e.session_id,
          e.value,
          we.min_date as created_at
      from events e
      join (select session_id, min(created_at) min_date
            from website_event
            where website_id = {websiteId:UUID}
              and created_at between {startDate:DateTime64} and {endDate:DateTime64}
            group by 1
          ) we
      on we.session_id = e.session_id)

      select
          website_event.referrer_domain as "name",
          sum(revenue.value) as "value"
      from revenue
      any left join (
        select website_id, session_id, referrer_domain, created_at
        from website_event
        where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}) website_event
      on website_event.website_id = revenue.website_id
      and website_event.session_id = revenue.session_id
      and website_event.created_at = revenue.created_at
      group by 1
      order by value desc
      `:`
    WITH events AS (
    select distinct
        website_id,
        session_id,
        sum(revenue) as "value"
    from website_revenue
    ${b}
    ${l}
    where website_id = {websiteId:UUID}
      and created_at between {startDate:DateTime64} and {endDate:DateTime64}
      and upper(currency) = {currency:String}
      ${c}
    group by 1,2),

    revenue AS (
    select
        e.website_id,
        e.session_id,
        e.value,
        we.min_date as created_at
    from events e
    join (select session_id, min(created_at) min_date
          from website_event
          where website_id = {websiteId:UUID}
            and created_at between {startDate:DateTime64} and {endDate:DateTime64}
          group by 1
        ) we
    on we.session_id = e.session_id),

    channels AS (
    select
        case when multiSearchAny(lower(utm_medium), ['cp', 'ppc', 'retargeting', 'paid']) != 0 then 'paid' else 'organic' end prefix,
        case
          when referrer_domain = '' and url_query = '' then 'direct'
          when multiSearchAny(lower(url_query), [${w(i.PAID_AD_PARAMS)}]) != 0 then 'paidAds'
          when multiSearchAny(lower(utm_medium), ['referral', 'app','link']) != 0 then 'referral'
          when position(lower(utm_medium), 'affiliate') > 0 then 'affiliate'
          when position(lower(utm_medium), 'sms') > 0 or position(lower(utm_source), 'sms') > 0 then 'sms'
          when multiSearchAny(lower(referrer_domain), [${w(i.LLM_DOMAINS)}]) != 0 then 'llm'
          when multiSearchAny(lower(referrer_domain), [${w(i.SEARCH_DOMAINS)}]) != 0 or position(lower(utm_medium), 'organic') > 0 then concat(prefix, 'Search')
          when multiSearchAny(lower(referrer_domain), [${w(i.SOCIAL_DOMAINS)}]) != 0 then concat(prefix, 'Social')
          when multiSearchAny(lower(referrer_domain), [${w(i.EMAIL_DOMAINS)}]) != 0 or position(lower(utm_medium), 'mail') > 0 then 'email'
          when multiSearchAny(lower(referrer_domain), [${w(i.SHOPPING_DOMAINS)}]) != 0 or position(lower(utm_medium), 'shop') > 0 then concat(prefix, 'Shopping')
          when multiSearchAny(lower(referrer_domain), [${w(i.VIDEO_DOMAINS)}]) != 0 or position(lower(utm_medium), 'video') > 0 then concat(prefix, 'Video')
          when referrer_domain != hostname and referrer_domain != '' then 'referral'
        else 'Unknown' end AS "name",
        sum(revenue.value) as "value"
    from revenue
    any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
      and created_at between {startDate:DateTime64} and {endDate:DateTime64}) website_event
    on website_event.website_id = revenue.website_id
    and website_event.session_id = revenue.session_id
    and website_event.created_at = revenue.created_at
    group by 1, 2)

    select name, sum(value) value
    from channels
    group by 1
    order by value desc;
    `,v)}function w(e){return e.map(e=>`'${e.replace(/'/g,"\\'")}'`).join(", ")}function c(e,t){return t.map(t=>`${e} ilike '%${t.replace(/'/g,"''")}%'`).join(" OR\n  ")}[s]=d.then?(await d)():d,e.s(["getRevenueMetrics",0,u]),n()}catch(e){n(e)}},!1),383245,e=>e.a(async(t,n)=>{try{var r=e.i(258319),i=e.i(32214),a=e.i(25168),s=e.i(335839),d=e.i(333040),u=e.i(238877),o=e.i(610104),_=e.i(542502),w=e.i(64633),c=t([i,d,u,o,_,w]);async function l(e){let{auth:t,body:n,error:d}=await (0,i.parseRequest)(e,s.reportResultSchema);if(d)return d();let{websiteId:c}=n;if(!await (0,u.canViewWebsiteSection)(t,c,"revenue"))return(0,a.unauthorized)();let l=await (0,i.setWebsiteDate)(c,n.parameters),v=await (0,i.getQueryFilters)(n.filters,c),{compare:b="prev"}=l,{startDate:m,endDate:p}=(0,r.getCompareDate)(b,l.startDate,l.endDate),h={...l,startDate:m,endDate:p},[{chart:f},y,D,g,I,S,A]=await Promise.all([(0,o.getRevenueChart)(c,l,v),(0,w.getRevenueStats)(c,l,v),(0,w.getRevenueStats)(c,h,v),(0,_.getRevenueMetrics)(c,l,v,"country"),(0,_.getRevenueMetrics)(c,l,v,"region"),(0,_.getRevenueMetrics)(c,l,v,"referrer"),(0,_.getRevenueMetrics)(c,l,v,"channel")]);return(0,a.json)({chart:f,total:{...y,comparison:D},country:g,region:I,referrer:S,channel:A})}[i,d,u,o,_,w]=c.then?(await c)():c,e.s(["POST",0,l]),n()}catch(e){n(e)}},!1),881055,e=>e.a(async(t,n)=>{try{var r=e.i(855839),i=e.i(266102),a=e.i(102273),s=e.i(572461),d=e.i(63995),u=e.i(81494),o=e.i(681640),_=e.i(420735),w=e.i(606917),c=e.i(250674),l=e.i(277766),v=e.i(405785),b=e.i(352698),m=e.i(715428),p=e.i(94999),h=e.i(193695);e.i(687439);var f=e.i(891715),y=e.i(383245),D=t([y]);[y]=D.then?(await D)():D;let I=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/reports/revenue/route",pathname:"/api/reports/revenue",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/reports/revenue/route.ts",nextConfigOutput:"standalone",userland:y,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:A,serverHooks:R}=I;async function g(e,t,n){n.requestMeta&&(0,s.setRequestMeta)(e,n.requestMeta),I.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/reports/revenue/route";r=r.replace(/\/index$/,"")||"/";let a=await I.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!a)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:y,deploymentId:D,params:g,nextConfig:S,parsedUrl:A,isDraftMode:R,prerenderManifest:$,routerServerContext:T,isOnDemandRevalidate:x,revalidateOnlyGenerated:E,resolvedPathname:U,clientReferenceManifest:C,serverActionsManifest:O}=a,N=(0,o.normalizeAppPath)(r),M=!!($.dynamicRoutes[N]||$.routes[U]),P=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,A,!1):t.end("This page could not be found"),null);if(M&&!R){let e=!!$.routes[U],t=$.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(S.adapterPath)return await P();throw new h.NoFallbackError}}let q=null;!M||I.isDev||R||(q=U,q="/index"===q?"/":q);let j=!0===I.isDev||!M,k=M&&!j;O&&C&&(0,u.setManifestsSingleton)({page:r,clientReferenceManifest:C,serverActionsManifest:O});let H=e.method||"GET",L=(0,d.getTracer)(),K=L.getActiveScopeSpan(),F=!!(null==T?void 0:T.isWrappedByNextServer),W=!!(0,s.getRequestMeta)(e,"minimalMode"),V=(0,s.getRequestMeta)(e,"incrementalCache")||await I.getIncrementalCache(e,S,$,W);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let B={params:g,previewProps:$.preview,renderOpts:{experimental:{authInterrupts:!!S.experimental.authInterrupts},cacheComponents:!!S.cacheComponents,supportsDynamicResponse:j,incrementalCache:V,cacheLifeProfiles:S.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,r,i)=>I.onRequestError(e,t,r,i,T)},sharedContext:{buildId:y,deploymentId:D}},G=new _.NodeNextRequest(e),Q=new _.NodeNextResponse(t),z=w.NextRequestAdapter.fromNodeNextRequest(G,(0,w.signalFromNodeResponse)(t));try{let a,s=async e=>I.handle(z,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=L.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=n.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",i),a.updateName(t))}else e.updateName(`${H} ${r}`)}),u=async a=>{var d,u;let o=async({previousCacheEntry:i})=>{try{if(!W&&x&&E&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(a);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&n.waitUntil&&(n.waitUntil(d),d=void 0);let u=B.renderOpts.collectedTags;if(!M)return await (0,v.sendResponse)(G,Q,r,B.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,b.toNodeOutgoingHttpHeaders)(r.headers);u&&(t[p.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=p.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,i=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=p.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,T),t}},_=await I.handleResponse({req:e,nextConfig:S,cacheKey:q,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:$,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:E,responseGenerator:o,waitUntil:n.waitUntil,isMinimalMode:W});if(!M)return null;if((null==_||null==(d=_.value)?void 0:d.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==_||null==(u=_.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});W||t.setHeader("x-nextjs-cache",x?"REVALIDATED":_.isMiss?"MISS":_.isStale?"STALE":"HIT"),R&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let w=(0,b.fromNodeOutgoingHttpHeaders)(_.value.headers);return W&&M||w.delete(p.NEXT_CACHE_TAGS_HEADER),!_.cacheControl||t.getHeader("Cache-Control")||w.get("Cache-Control")||w.set("Cache-Control",(0,m.getCacheControlHeader)(_.cacheControl)),await (0,v.sendResponse)(G,Q,new Response(_.value.body,{headers:w,status:_.value.status||200})),null};F&&K?await u(K):(a=L.getActiveScopeSpan(),await L.withPropagatedContext(e.headers,()=>L.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:d.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},u),void 0,!F))}catch(t){if(t instanceof h.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:x})},!1,T),M)throw t;return await (0,v.sendResponse)(G,Q,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:A})},"routeModule",0,I,"serverHooks",0,R,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,A]),n()}catch(e){n(e)}},!1),916005,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_node_buffer_0063pbu._.js"].map(t=>e.l(t))).then(()=>t(951615)))},699633,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_@prisma_client_runtime_query_compiler_fast_bg_postgresql_mjs_109us0s._.js"].map(t=>e.l(t))).then(()=>t(813930)))},795459,e=>{e.v(t=>Promise.all(["server/chunks/0q_8_client_runtime_query_compiler_fast_bg_postgresql_wasm-base64_mjs_0x2zncr._.js"].map(t=>e.l(t))).then(()=>t(11470)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cy9ukv._.js.map