module.exports=[966302,e=>e.a(async(t,s)=>{try{var n=e.i(81862),i=e.i(869582),a=e.i(843793),r=e.i(698043),o=t([r]);[r]=o.then?(await o)():o;let c="getRevenueSessions";async function d(...e){return(0,a.runQuery)({[a.PRISMA]:()=>l(...e),[a.CLICKHOUSE]:()=>u(...e)})}async function l(e,t,s){let{pagedRawQuery:n,parseFilters:a}=r.default,{search:o}=s,{filterQuery:d,dateQuery:l,cohortQuery:u,queryParams:p}=a({...s,websiteId:e,currency:t,search:o?`%${o}%`:void 0}),v=o?`and (session.browser ilike {{search}}
           or session.os ilike {{search}}
           or session.device ilike {{search}}
           or session.city ilike {{search}})`:"";return n(`
    select
      session.session_id as "id",
      session.website_id as "websiteId",
      website_event.hostname,
      session.browser,
      session.os,
      session.device,
      session.screen,
      session.language,
      session.country,
      session.region,
      session.city,
      min(website_event.created_at) as "firstAt",
      max(website_event.created_at) as "lastAt",
      count(distinct website_event.visit_id) as "visits",
      sum(case when website_event.event_type = 1 then 1 else 0 end) as "views",
      sum(case when website_event.event_type = 2 then 1 else 0 end) as "events",
      max(website_event.created_at) as "createdAt"
    from website_event
    ${u}
    join session
      on session.session_id = website_event.session_id
      and session.website_id = website_event.website_id
    join (
      select distinct session_id
      from revenue
      where website_id = {{websiteId::uuid}}
      and revenue.created_at between {{startDate}} and {{endDate}}
        and upper(currency) = {{currency}}
    ) rev on rev.session_id = website_event.session_id
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.event_type != ${i.EVENT_TYPE.performance}
    ${l}
    ${d}
    ${v}
    group by
      session.session_id,
      session.website_id,
      website_event.hostname,
      session.browser,
      session.os,
      session.device,
      session.screen,
      session.language,
      session.country,
      session.region,
      session.city
    order by max(website_event.created_at) desc
    `,p,s,c)}async function u(e,t,s){let{pagedRawQuery:a,parseFilters:r,getDateStringSQL:o}=n.default,{search:d}=s,{filterQuery:l,dateQuery:u,cohortQuery:p,queryParams:v}=r({...s,websiteId:e,currency:t}),w=d?`and ((positionCaseInsensitive(browser, {search:String}) > 0)
           or (positionCaseInsensitive(city, {search:String}) > 0)
           or (positionCaseInsensitive(os, {search:String}) > 0)
           or (positionCaseInsensitive(device, {search:String}) > 0))`:"";return a(`
    select
      session_id as id,
      website_id as websiteId,
      hostname,
      browser,
      os,
      device,
      screen,
      language,
      country,
      region,
      city,
      ${o("min(created_at)")} as firstAt,
      ${o("max(created_at)")} as lastAt,
      uniq(visit_id) as visits,
      sumIf(1, event_type = 1) as views,
      sumIf(1, event_type = 2) as events,
      max(created_at) as createdAt
    from website_event
    ${p}
    where website_id = {websiteId:UUID}
      and event_type != ${i.EVENT_TYPE.performance}
    ${u}
    ${l}
    ${w}
      and session_id in (
        select distinct session_id
        from website_revenue
        where website_id = {websiteId:UUID}
        ${u}
          and upper(currency) = {currency:String}
      )
    group by session_id, website_id, hostname, browser, os, device, screen, language, country, region, city
    order by max(created_at) desc
    `,v,s,c)}e.s(["getRevenueSessions",0,d]),s()}catch(e){s(e)}},!1),842984,e=>e.a(async(t,s)=>{try{var n=e.i(868776),i=e.i(32214),a=e.i(25168),r=e.i(335839),o=e.i(333040),d=e.i(238877),l=e.i(966302),u=t([i,o,d,l]);async function c(e,{params:t}){let s=(0,r.withDateRange)({currency:n.z.string(),...r.filterParams,...r.pagingParams,...r.searchParams}),{auth:o,query:u,error:p}=await (0,i.parseRequest)(e,s);if(p)return p();let{websiteId:v}=await t;if(!await (0,d.canViewWebsiteSection)(o,v,"revenue"))return(0,a.unauthorized)();let{currency:w,..._}=u,h=await (0,i.getQueryFilters)(_,v),b=await (0,l.getRevenueSessions)(v,w,h);return(0,a.json)(b)}[i,o,d,l]=u.then?(await u)():u,e.s(["GET",0,c]),s()}catch(e){s(e)}},!1),511252,e=>e.a(async(t,s)=>{try{var n=e.i(855839),i=e.i(266102),a=e.i(102273),r=e.i(572461),o=e.i(63995),d=e.i(81494),l=e.i(681640),u=e.i(420735),c=e.i(606917),p=e.i(250674),v=e.i(277766),w=e.i(405785),_=e.i(352698),h=e.i(715428),b=e.i(94999),m=e.i(193695);e.i(687439);var g=e.i(891715),y=e.i(842984),R=t([y]);[y]=R.then?(await R)():R;let E=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/websites/[websiteId]/revenue/sessions/route",pathname:"/api/websites/[websiteId]/revenue/sessions",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/websites/[websiteId]/revenue/sessions/route.ts",nextConfigOutput:"standalone",userland:y,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:x,serverHooks:A}=E;async function f(e,t,s){s.requestMeta&&(0,r.setRequestMeta)(e,s.requestMeta),E.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/websites/[websiteId]/revenue/sessions/route";n=n.replace(/\/index$/,"")||"/";let a=await E.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!a)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:y,deploymentId:R,params:f,nextConfig:C,parsedUrl:x,isDraftMode:A,prerenderManifest:I,routerServerContext:P,isOnDemandRevalidate:S,revalidateOnlyGenerated:T,resolvedPathname:N,clientReferenceManifest:q,serverActionsManifest:$}=a,O=(0,l.normalizeAppPath)(n),U=!!(I.dynamicRoutes[O]||I.routes[N]),k=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,x,!1):t.end("This page could not be found"),null);if(U&&!A){let e=!!I.routes[N],t=I.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await k();throw new m.NoFallbackError}}let D=null;!U||E.isDev||A||(D=N,D="/index"===D?"/":D);let H=!0===E.isDev||!U,M=U&&!H;$&&q&&(0,d.setManifestsSingleton)({page:n,clientReferenceManifest:q,serverActionsManifest:$});let j=e.method||"GET",F=(0,o.getTracer)(),K=F.getActiveScopeSpan(),B=!!(null==P?void 0:P.isWrappedByNextServer),L=!!(0,r.getRequestMeta)(e,"minimalMode"),V=(0,r.getRequestMeta)(e,"incrementalCache")||await E.getIncrementalCache(e,C,I,L);null==V||V.resetRequestCache(),globalThis.__incrementalCache=V;let z={params:f,previewProps:I.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:H,incrementalCache:V,cacheLifeProfiles:C.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,s,n,i)=>E.onRequestError(e,t,n,i,P)},sharedContext:{buildId:y,deploymentId:R}},G=new u.NodeNextRequest(e),W=new u.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(G,(0,c.signalFromNodeResponse)(t));try{let a,r=async e=>E.handle(X,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let s=F.getRootSpanAttributes();if(!s)return;if(s.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${s.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=s.get("next.route");if(i){let t=`${j} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",i),a.updateName(t))}else e.updateName(`${j} ${n}`)}),d=async a=>{var o,d;let l=async({previousCacheEntry:i})=>{try{if(!L&&S&&T&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await r(a);e.fetchMetrics=z.renderOpts.fetchMetrics;let o=z.renderOpts.pendingWaitUntil;o&&s.waitUntil&&(s.waitUntil(o),o=void 0);let d=z.renderOpts.collectedTags;if(!U)return await (0,w.sendResponse)(G,W,n,z.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[b.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let s=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=b.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,i=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=b.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:s,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,v.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:S})},!1,P),t}},u=await E.handleResponse({req:e,nextConfig:C,cacheKey:D,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:s.waitUntil,isMinimalMode:L});if(!U)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});L||t.setHeader("x-nextjs-cache",S?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,_.fromNodeOutgoingHttpHeaders)(u.value.headers);return L&&U||c.delete(b.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,w.sendResponse)(G,W,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};B&&K?await d(K):(a=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(p.BaseServerSpan.handleRequest,{spanName:`${j} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},d),void 0,!B))}catch(t){if(t instanceof m.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,v.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:S})},!1,P),U)throw t;return await (0,w.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,f,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:x})},"routeModule",0,E,"serverHooks",0,A,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,x]),s()}catch(e){s(e)}},!1),916005,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_node_buffer_0063pbu._.js"].map(t=>e.l(t))).then(()=>t(951615)))},699633,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_@prisma_client_runtime_query_compiler_fast_bg_postgresql_mjs_109us0s._.js"].map(t=>e.l(t))).then(()=>t(813930)))},795459,e=>{e.v(t=>Promise.all(["server/chunks/0q_8_client_runtime_query_compiler_fast_bg_postgresql_wasm-base64_mjs_0x2zncr._.js"].map(t=>e.l(t))).then(()=>t(11470)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0.1~xf3._.js.map