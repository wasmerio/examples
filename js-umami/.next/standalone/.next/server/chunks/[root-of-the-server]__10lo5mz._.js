module.exports=[542502,e=>e.a(async(t,n)=>{try{var r=e.i(81862),i=e.i(869582),a=e.i(843793),s=e.i(698043),d=t([s]);async function o(...e){return(0,a.runQuery)({[a.PRISMA]:()=>u(...e),[a.CLICKHOUSE]:()=>_(...e)})}async function u(e,t,n,r){let{startDate:a,endDate:d,currency:o}=t,{rawQuery:u,parseFilters:_}=s.default,{queryParams:l,filterQuery:w,cohortQuery:m,joinSessionQuery:v}=_({...n,websiteId:e,startDate:a,endDate:d,currency:o}),b=w||m?`join (select *
               from website_event
               where website_id = {{websiteId::uuid}}
                  and created_at between {{startDate}} and {{endDate}}
                  and event_type = 2) website_event
        on website_event.website_id = revenue.website_id
          and website_event.session_id = revenue.session_id
          and website_event.event_id = revenue.event_id`:"";return u("country"===r?`
      select
        session.country as "name",
        sum(revenue) as "value"
      from revenue
      ${b}
      join session
        on session.website_id = revenue.website_id
          and session.session_id = revenue.session_id
      ${m}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${w}
      group by session.country
      order by value desc
      `:"region"===r?`
      select
        session.country,
        session.region as "name",
        sum(revenue.revenue) as "value"
      from revenue
      ${b}
      join session
        on session.website_id = revenue.website_id
          and session.session_id = revenue.session_id
      ${m}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${w}
      group by session.country, session.region
      order by value desc
      `:"referrer"===r?`
      WITH events AS (
        select
          revenue.website_id,
          revenue.session_id,
          sum(revenue.revenue) as "value"
        from revenue
        ${b}
        ${m}
        ${v}
        where revenue.website_id = {{websiteId::uuid}}
          and revenue.created_at between {{startDate}} and {{endDate}}
          and upper(revenue.currency) = {{currency}}
          ${w}
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
      ${b}
      ${m}
      ${v}
      where revenue.website_id = {{websiteId::uuid}}
        and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(revenue.currency) = {{currency}}
        ${w}
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
    `,l)}async function _(e,t,n,a){let{startDate:s,endDate:d,currency:o}=t,{rawQuery:u,parseFilters:_}=r.default,{filterQuery:c,cohortQuery:w,queryParams:m}=_({...n,websiteId:e,startDate:s,endDate:d,currency:o}),v=c?`any left join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2) website_event
    on website_event.website_id = website_revenue.website_id
      and website_event.session_id = website_revenue.session_id
      and website_event.event_id = website_revenue.event_id`:"";return u("country"===a?`
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
      ${w}
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
      ${w}
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
      ${v}
      ${w}
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
    ${v}
    ${w}
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
          when multiSearchAny(lower(url_query), [${l(i.PAID_AD_PARAMS)}]) != 0 then 'paidAds'
          when multiSearchAny(lower(utm_medium), ['referral', 'app','link']) != 0 then 'referral'
          when position(lower(utm_medium), 'affiliate') > 0 then 'affiliate'
          when position(lower(utm_medium), 'sms') > 0 or position(lower(utm_source), 'sms') > 0 then 'sms'
          when multiSearchAny(lower(referrer_domain), [${l(i.LLM_DOMAINS)}]) != 0 then 'llm'
          when multiSearchAny(lower(referrer_domain), [${l(i.SEARCH_DOMAINS)}]) != 0 or position(lower(utm_medium), 'organic') > 0 then concat(prefix, 'Search')
          when multiSearchAny(lower(referrer_domain), [${l(i.SOCIAL_DOMAINS)}]) != 0 then concat(prefix, 'Social')
          when multiSearchAny(lower(referrer_domain), [${l(i.EMAIL_DOMAINS)}]) != 0 or position(lower(utm_medium), 'mail') > 0 then 'email'
          when multiSearchAny(lower(referrer_domain), [${l(i.SHOPPING_DOMAINS)}]) != 0 or position(lower(utm_medium), 'shop') > 0 then concat(prefix, 'Shopping')
          when multiSearchAny(lower(referrer_domain), [${l(i.VIDEO_DOMAINS)}]) != 0 or position(lower(utm_medium), 'video') > 0 then concat(prefix, 'Video')
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
    `,m)}function l(e){return e.map(e=>`'${e.replace(/'/g,"\\'")}'`).join(", ")}function c(e,t){return t.map(t=>`${e} ilike '%${t.replace(/'/g,"''")}%'`).join(" OR\n  ")}[s]=d.then?(await d)():d,e.s(["getRevenueMetrics",0,o]),n()}catch(e){n(e)}},!1),54797,e=>e.a(async(t,n)=>{try{var r=e.i(868776),i=e.i(32214),a=e.i(25168),s=e.i(335839),d=e.i(333040),o=e.i(238877),u=e.i(542502),_=t([i,d,o,u]);[i,d,o,u]=_.then?(await _)():_;let c=r.z.enum(["country","region","referrer","channel"]);async function l(e,{params:t}){let n=(0,s.withDateRange)({type:c,currency:r.z.string(),...s.filterParams}),{auth:d,query:_,error:w}=await (0,i.parseRequest)(e,n);if(w)return w();let{websiteId:m}=await t;if(!await (0,o.canViewWebsiteSection)(d,m,"revenue"))return(0,a.unauthorized)();let{type:v,currency:b}=_,p=await (0,i.getQueryFilters)(_,m);if(!v)return(0,a.badRequest)();let h={...p,currency:b};return(0,a.json)(await (0,u.getRevenueMetrics)(m,h,p,v))}e.s(["GET",0,l]),n()}catch(e){n(e)}},!1),619425,e=>e.a(async(t,n)=>{try{var r=e.i(855839),i=e.i(266102),a=e.i(102273),s=e.i(572461),d=e.i(63995),o=e.i(81494),u=e.i(681640),_=e.i(420735),l=e.i(606917),c=e.i(250674),w=e.i(277766),m=e.i(405785),v=e.i(352698),b=e.i(715428),p=e.i(94999),h=e.i(193695);e.i(687439);var f=e.i(891715),y=e.i(54797),D=t([y]);[y]=D.then?(await D)():D;let A=new r.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/websites/[websiteId]/revenue/metrics/route",pathname:"/api/websites/[websiteId]/revenue/metrics",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/websites/[websiteId]/revenue/metrics/route.ts",nextConfigOutput:"standalone",userland:y,...{}}),{workAsyncStorage:I,workUnitAsyncStorage:S,serverHooks:R}=A;async function g(e,t,n){n.requestMeta&&(0,s.setRequestMeta)(e,n.requestMeta),A.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/websites/[websiteId]/revenue/metrics/route";r=r.replace(/\/index$/,"")||"/";let a=await A.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!a)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:y,deploymentId:D,params:g,nextConfig:I,parsedUrl:S,isDraftMode:R,prerenderManifest:T,routerServerContext:$,isOnDemandRevalidate:E,revalidateOnlyGenerated:x,resolvedPathname:O,clientReferenceManifest:C,serverActionsManifest:U}=a,N=(0,u.normalizeAppPath)(r),P=!!(T.dynamicRoutes[N]||T.routes[O]),M=async()=>((null==$?void 0:$.render404)?await $.render404(e,t,S,!1):t.end("This page could not be found"),null);if(P&&!R){let e=!!T.routes[O],t=T.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(I.adapterPath)return await M();throw new h.NoFallbackError}}let k=null;!P||A.isDev||R||(k=O,k="/index"===k?"/":k);let q=!0===A.isDev||!P,j=P&&!q;U&&C&&(0,o.setManifestsSingleton)({page:r,clientReferenceManifest:C,serverActionsManifest:U});let H=e.method||"GET",L=(0,d.getTracer)(),F=L.getActiveScopeSpan(),K=!!(null==$?void 0:$.isWrappedByNextServer),V=!!(0,s.getRequestMeta)(e,"minimalMode"),W=(0,s.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,I,T,V);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let B={params:g,previewProps:T.preview,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:q,incrementalCache:W,cacheLifeProfiles:I.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,r,i)=>A.onRequestError(e,t,r,i,$)},sharedContext:{buildId:y,deploymentId:D}},G=new _.NodeNextRequest(e),z=new _.NodeNextResponse(t),X=l.NextRequestAdapter.fromNodeNextRequest(G,(0,l.signalFromNodeResponse)(t));try{let a,s=async e=>A.handle(X,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=L.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=n.get("next.route");if(i){let t=`${H} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",i),a.updateName(t))}else e.updateName(`${H} ${r}`)}),o=async a=>{var d,o;let u=async({previousCacheEntry:i})=>{try{if(!V&&E&&x&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(a);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&n.waitUntil&&(n.waitUntil(d),d=void 0);let o=B.renderOpts.collectedTags;if(!P)return await (0,m.sendResponse)(G,z,r,B.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,v.toNodeOutgoingHttpHeaders)(r.headers);o&&(t[p.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=p.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,i=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=p.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,w.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:E})},!1,$),t}},_=await A.handleResponse({req:e,nextConfig:I,cacheKey:k,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:x,responseGenerator:u,waitUntil:n.waitUntil,isMinimalMode:V});if(!P)return null;if((null==_||null==(d=_.value)?void 0:d.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==_||null==(o=_.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});V||t.setHeader("x-nextjs-cache",E?"REVALIDATED":_.isMiss?"MISS":_.isStale?"STALE":"HIT"),R&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,v.fromNodeOutgoingHttpHeaders)(_.value.headers);return V&&P||l.delete(p.NEXT_CACHE_TAGS_HEADER),!_.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,b.getCacheControlHeader)(_.cacheControl)),await (0,m.sendResponse)(G,z,new Response(_.value.body,{headers:l,status:_.value.status||200})),null};K&&F?await o(F):(a=L.getActiveScopeSpan(),await L.withPropagatedContext(e.headers,()=>L.trace(c.BaseServerSpan.handleRequest,{spanName:`${H} ${r}`,kind:d.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},o),void 0,!K))}catch(t){if(t instanceof h.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,w.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:E})},!1,$),P)throw t;return await (0,m.sendResponse)(G,z,new Response(null,{status:500})),null}}e.s(["handler",0,g,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:S})},"routeModule",0,A,"serverHooks",0,R,"workAsyncStorage",0,I,"workUnitAsyncStorage",0,S]),n()}catch(e){n(e)}},!1),916005,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_node_buffer_0063pbu._.js"].map(t=>e.l(t))).then(()=>t(951615)))},699633,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_@prisma_client_runtime_query_compiler_fast_bg_postgresql_mjs_109us0s._.js"].map(t=>e.l(t))).then(()=>t(813930)))},795459,e=>{e.v(t=>Promise.all(["server/chunks/0q_8_client_runtime_query_compiler_fast_bg_postgresql_wasm-base64_mjs_0x2zncr._.js"].map(t=>e.l(t))).then(()=>t(11470)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__10lo5mz._.js.map