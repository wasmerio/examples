module.exports=[312363,e=>e.a(async(t,a)=>{try{var i=e.i(81862),n=e.i(869582),s=e.i(843793),r=e.i(698043),d=t([r]);async function o(...e){return(0,s.runQuery)({[s.PRISMA]:()=>c(...e),[s.CLICKHOUSE]:()=>l(...e)})}async function c(e,t,a){let{model:i,type:s}=t,{rawQuery:d,parseFilters:o}=r.default,c="path"===s?n.EVENT_TYPE.pageView:n.EVENT_TYPE.customEvent,l="path"===s?"url_path":"event_name",{filterQuery:u,joinSessionQuery:w,cohortQuery:_,queryParams:m}=o({...a,...t,websiteId:e,eventType:c});function p(e){return`
    select
        coalesce(we.${e}, '') as "name",
        count(distinct we.session_id) as "value"
    from model m
    join website_event we
    on we.created_at = m.created_at
        and we.session_id = m.session_id
    where we.website_id = {{websiteId::uuid}}
          and we.created_at between {{startDate}} and {{endDate}}
          and we.${e} != ''
    group by 1
    order by 2 desc
    limit 20`}let b=`WITH events AS (
        select distinct
            website_event.session_id,
            max(website_event.created_at) max_dt
        from website_event
        ${_}
        ${w}
        where website_event.website_id = {{websiteId::uuid}}
          and website_event.created_at between {{startDate}} and {{endDate}}
          and website_event.${l} = {{step}}
          ${u}
        group by 1),`;function h(e){return"first-click"===e?`

    model AS (select e.session_id,
        min(we.created_at) created_at
    from events e
    join website_event we
    on we.session_id = e.session_id
    where we.website_id = {{websiteId::uuid}}
          and we.created_at between {{startDate}} and {{endDate}}
    group by e.session_id)`:`

    model AS (select e.session_id,
        max(we.created_at) created_at
    from events e
    join website_event we
    on we.session_id = e.session_id
    where we.website_id = {{websiteId::uuid}}
          and we.created_at between {{startDate}} and {{endDate}}
          and we.created_at < e.max_dt
    group by e.session_id)`}let v=await d(`
    ${b}
    ${h(i)}
    select coalesce(we.referrer_domain, '') as "name",
        count(distinct we.session_id) value
    from model m
    join website_event we
    on we.created_at = m.created_at
        and we.session_id = m.session_id
    join session s
    on s.session_id = m.session_id
    where we.website_id = {{websiteId::uuid}}
          and we.created_at between {{startDate}} and {{endDate}}
          and we.referrer_domain != regexp_replace(we.hostname, '^www.', '')
          and we.referrer_domain != ''
    group by 1
    order by 2 desc
    limit 20
    `,m),f=await d(`
    ${b}
    ${h(i)},

    results AS (
    select case
            when coalesce(gclid, '') != '' then 'Google Ads'
            when coalesce(fbclid, '') != '' then 'Facebook / Meta'
            when coalesce(msclkid, '') != '' then 'Microsoft Ads'
            when coalesce(ttclid, '') != '' then 'TikTok Ads'
            when coalesce(li_fat_id, '') != '' then 'LinkedIn Ads'
            when coalesce(twclid, '') != '' then 'Twitter Ads (X)'
            else ''
          end as "name",
        count(distinct we.session_id) as "value"
    from model m
    join website_event we
    on we.created_at = m.created_at
        and we.session_id = m.session_id
    where we.website_id = {{websiteId::uuid}}
          and we.created_at between {{startDate}} and {{endDate}}
    group by 1
    order by 2 desc
    limit 20)
    SELECT *
    FROM results
    WHERE name != ''
    `,m),g=await d(`
    ${b}
    ${h(i)}
    ${p("utm_source")}
    `,m),E=await d(`
    ${b}
    ${h(i)}
    ${p("utm_medium")}
    `,m),$=await d(`
    ${b}
    ${h(i)}
    ${p("utm_campaign")}
    `,m),R=await d(`
    ${b}
    ${h(i)}
    ${p("utm_content")}
    `,m),D=await d(`
    ${b}
    ${h(i)}
    ${p("utm_term")}
    `,m),y=await d(`
    select
        count(*) as "pageviews",
        count(distinct website_event.session_id) as "visitors",
        count(distinct website_event.visit_id) as "visits"
    from website_event
    ${w}
    ${_}
    where website_event.website_id = {{websiteId::uuid}}
        and website_event.created_at between {{startDate}} and {{endDate}}
        and website_event.${l} = {{step}}
        ${u}
    `,m).then(e=>e?.[0]);return{referrer:v,paidAds:f,utm_source:g,utm_medium:E,utm_campaign:$,utm_content:R,utm_term:D,total:y}}async function l(e,t,a){let{model:s,type:r}=t,{rawQuery:d,parseFilters:o}=i.default,c="path"===r?n.EVENT_TYPE.pageView:n.EVENT_TYPE.customEvent,l="path"===r?"url_path":"event_name",{filterQuery:u,cohortQuery:w,queryParams:_}=o({...a,...t,websiteId:e,eventType:c});function m(e){return`
      select
          we.${e} name,
          uniqExact(we.session_id) value
      from model m
      join (
        select *
        from website_event
        where website_id = {websiteId:UUID}
          and created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ) we
      on we.created_at = m.created_at
          and we.session_id = m.session_id
      where we.${e} != ''
      group by 1
      order by 2 desc
      limit 20
    `}function p(e){return"first-click"===e?`
        model AS (select e.session_id,
            min(we.created_at) created_at
        from events e
        join (
          select *
          from website_event
          where website_id = {websiteId:UUID}
            and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        ) we
        on we.session_id = e.session_id
        group by e.session_id)
      `:`
      model AS (select e.session_id,
          max(we.created_at) created_at
      from events e
      join (
        select *
        from website_event
        where website_id = {websiteId:UUID}
          and created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ) we
      on we.session_id = e.session_id
      where we.created_at < e.max_dt
      group by e.session_id)
      `}let b=`WITH events AS (
        select distinct
            session_id,
            max(created_at) max_dt
        from website_event
        ${w}
        where website_id = {websiteId:UUID}
          and created_at between {startDate:DateTime64} and {endDate:DateTime64}
          and ${l} = {step:String}
          ${u}
        group by 1),`,h=await d(`
    ${b}
    ${p(s)}
    select we.referrer_domain name,
        uniqExact(we.session_id) value
    from model m
    join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
    ) we
    on we.created_at = m.created_at
        and we.session_id = m.session_id
    where we.referrer_domain != hostname
      and we.referrer_domain != ''
    group by 1
    order by 2 desc
    limit 20
    `,_),v=await d(`
    ${b}
    ${p(s)}
    select multiIf(gclid != '', 'Google Ads',
                   fbclid != '', 'Facebook / Meta',
                   msclkid != '', 'Microsoft Ads',
                   ttclid != '', 'TikTok Ads',
                   li_fat_id != '', 'LinkedIn Ads',
                   twclid != '', 'Twitter Ads (X)','') name,
        uniqExact(we.session_id) value
    from model m
    join (
      select *
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
    ) we
    on we.created_at = m.created_at
        and we.session_id = m.session_id
    where name != ''
    group by 1
    order by 2 desc
    limit 20
    `,_),f=await d(`
    ${b}
    ${p(s)}
    ${m("utm_source")}
    `,_),g=await d(`
    ${b}
    ${p(s)}
    ${m("utm_medium")}
    `,_),E=await d(`
    ${b}
    ${p(s)}
    ${m("utm_campaign")}
    `,_),$=await d(`
    ${b}
    ${p(s)}
    ${m("utm_content")}
    `,_),R=await d(`
    ${b}
    ${p(s)}
    ${m("utm_term")}
    `,_),D=await d(`
    select 
        count(*) as "pageviews",
        uniqExact(session_id) as "visitors",
        uniqExact(visit_id) as "visits"
    from website_event
    ${w}
    where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and ${l} = {step:String}
        ${u}
    `,_).then(e=>e?.[0]);return{referrer:h,paidAds:v,utm_source:f,utm_medium:g,utm_campaign:E,utm_content:$,utm_term:R,total:D}}[r]=d.then?(await d)():d,e.s(["getAttribution",0,o]),a()}catch(e){a(e)}},!1),563303,e=>e.a(async(t,a)=>{try{var i=e.i(32214),n=e.i(25168),s=e.i(335839),r=e.i(333040),d=e.i(238877),o=e.i(312363),c=t([i,r,d,o]);async function l(e){let{auth:t,body:a,error:r}=await (0,i.parseRequest)(e,s.reportResultSchema);if(r)return r();let{websiteId:c}=a;if(!await (0,d.canViewWebsiteSection)(t,c,"attribution"))return(0,n.unauthorized)();let l=await (0,i.setWebsiteDate)(c,a.parameters),u=await (0,i.getQueryFilters)(a.filters,c),w=await (0,o.getAttribution)(c,l,u);return(0,n.json)(w)}[i,r,d,o]=c.then?(await c)():c,e.s(["POST",0,l]),a()}catch(e){a(e)}},!1),299206,e=>e.a(async(t,a)=>{try{var i=e.i(855839),n=e.i(266102),s=e.i(102273),r=e.i(572461),d=e.i(63995),o=e.i(81494),c=e.i(681640),l=e.i(420735),u=e.i(606917),w=e.i(250674),_=e.i(277766),m=e.i(405785),p=e.i(352698),b=e.i(715428),h=e.i(94999),v=e.i(193695);e.i(687439);var f=e.i(891715),g=e.i(563303),E=t([g]);[g]=E.then?(await E)():E;let R=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/reports/attribution/route",pathname:"/api/reports/attribution",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/reports/attribution/route.ts",nextConfigOutput:"standalone",userland:g,...{}}),{workAsyncStorage:D,workUnitAsyncStorage:y,serverHooks:T}=R;async function $(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),R.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/reports/attribution/route";i=i.replace(/\/index$/,"")||"/";let s=await R.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,deploymentId:E,params:$,nextConfig:D,parsedUrl:y,isDraftMode:T,prerenderManifest:A,routerServerContext:x,isOnDemandRevalidate:I,revalidateOnlyGenerated:C,resolvedPathname:S,clientReferenceManifest:U,serverActionsManifest:P}=s,N=(0,c.normalizeAppPath)(i),k=!!(A.dynamicRoutes[N]||A.routes[S]),q=async()=>((null==x?void 0:x.render404)?await x.render404(e,t,y,!1):t.end("This page could not be found"),null);if(k&&!T){let e=!!A.routes[S],t=A.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(D.adapterPath)return await q();throw new v.NoFallbackError}}let O=null;!k||R.isDev||T||(O=S,O="/index"===O?"/":O);let H=!0===R.isDev||!k,M=k&&!H;P&&U&&(0,o.setManifestsSingleton)({page:i,clientReferenceManifest:U,serverActionsManifest:P});let j=e.method||"GET",F=(0,d.getTracer)(),V=F.getActiveScopeSpan(),K=!!(null==x?void 0:x.isWrappedByNextServer),L=!!(0,r.getRequestMeta)(e,"minimalMode"),W=(0,r.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,D,A,L);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let B={params:$,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:H,incrementalCache:W,cacheLifeProfiles:D.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,i,n)=>R.onRequestError(e,t,i,n,x)},sharedContext:{buildId:g,deploymentId:E}},G=new l.NodeNextRequest(e),X=new l.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let s,r=async e=>R.handle(Y,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==w.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${j} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",n),s.updateName(t))}else e.updateName(`${j} ${i}`)}),o=async s=>{var d,o;let c=async({previousCacheEntry:n})=>{try{if(!L&&I&&C&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await r(s);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let o=B.renderOpts.collectedTags;if(!k)return await (0,m.sendResponse)(G,X,i,B.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:I})},!1,x),t}},l=await R.handleResponse({req:e,nextConfig:D,cacheKey:O,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:I,revalidateOnlyGenerated:C,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:L});if(!k)return null;if((null==l||null==(d=l.value)?void 0:d.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",I?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return L&&k||u.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,b.getCacheControlHeader)(l.cacheControl)),await (0,m.sendResponse)(G,X,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};K&&V?await o(V):(s=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(w.BaseServerSpan.handleRequest,{spanName:`${j} ${i}`,kind:d.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},o),void 0,!K))}catch(t){if(t instanceof v.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:I})},!1,x),k)throw t;return await (0,m.sendResponse)(G,X,new Response(null,{status:500})),null}}e.s(["handler",0,$,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:y})},"routeModule",0,R,"serverHooks",0,T,"workAsyncStorage",0,D,"workUnitAsyncStorage",0,y]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0q5nhn_._.js.map