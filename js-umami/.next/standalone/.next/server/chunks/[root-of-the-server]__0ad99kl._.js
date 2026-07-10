module.exports=[888312,e=>e.a(async(t,a)=>{try{var n=e.i(81862),i=e.i(869582),s=e.i(843793),r=e.i(698043),d=t([r]);[r]=d.then?(await d)():d;let _="getEventData";async function o(...e){return(0,s.runQuery)({[s.PRISMA]:()=>l(...e),[s.CLICKHOUSE]:()=>u(...e)})}async function l(e,t){let{rawQuery:a,parseFilters:n}=r.default,{page:s=1,pageSize:d}=t,o=+d||i.DEFAULT_PAGE_SIZE,{filterQuery:l,cohortQuery:u,joinSessionQuery:v,queryParams:c}=n({...t,websiteId:e}),p=`
    select website_event.event_id
    from website_event
    join event_data on event_data.website_event_id = website_event.event_id
      and event_data.website_id = {{websiteId::uuid}}
      and event_data.created_at between {{startDate}} and {{endDate}}
    ${u}
    ${v}
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.created_at between {{startDate}} and {{endDate}}
      ${l}
    group by website_event.event_id
  `,w=await a(`select count(*) as num from (${p}) t`,c).then(e=>e[0].num);return{data:await a(`
    with paged_events as (
      ${p}
      order by max(website_event.created_at) desc
      limit ${o} offset ${o*(s-1)}
    )
    select
      event_data.website_id as "websiteId",
      event_data.website_event_id as "eventId",
      website_event.event_name as "eventName",
      event_data.data_key as "dataKey",
      event_data.string_value as "stringValue",
      event_data.number_value as "numberValue",
      event_data.date_value as "dateValue",
      event_data.data_type as "dataType",
      event_data.created_at as "createdAt"
    from event_data
    join website_event on website_event.event_id = event_data.website_event_id
      and website_event.website_id = {{websiteId::uuid}}
      and website_event.created_at between {{startDate}} and {{endDate}}
    join paged_events on paged_events.event_id = event_data.website_event_id
    where event_data.website_id = {{websiteId::uuid}}
      and event_data.created_at between {{startDate}} and {{endDate}}
    order by event_data.created_at desc
    `,c,_),count:w,page:+s,pageSize:o}}async function u(e,t){let{rawQuery:a,parseFilters:s}=n.default,{page:r=1,pageSize:d}=t,o=+d||i.DEFAULT_PAGE_SIZE,{filterQuery:l,cohortQuery:u,queryParams:v}=s({...t,websiteId:e}),c=`
    select event_data.event_id
    from event_data
    any left join (
      select event_id, session_id, website_id, event_name, created_at
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2
    ) website_event
    on website_event.event_id = event_data.event_id
      and website_event.session_id = event_data.session_id
      and website_event.website_id = event_data.website_id
    ${u}
    where event_data.website_id = {websiteId:UUID}
      and event_data.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ${l}
    group by event_data.event_id
  `,p=await a(`select count(*) as num from (${c}) t`,v).then(e=>e[0].num);return{data:await a(`
    with paged_events as (
      ${c}
      order by max(event_data.created_at) desc
      limit ${o} offset ${o*(r-1)}
    )
    select
      event_data.website_id as websiteId,
      event_data.event_id as eventId,
      website_event.event_name as eventName,
      data_key as dataKey,
      string_value as stringValue,
      number_value as numberValue,
      date_value as dateValue,
      data_type as dataType,
      event_data.created_at as createdAt
    from event_data
    any left join (
      select event_id, session_id, website_id, event_name
      from website_event
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type = 2
    ) website_event
    on website_event.event_id = event_data.event_id
      and website_event.session_id = event_data.session_id
      and website_event.website_id = event_data.website_id
    inner join paged_events on paged_events.event_id = event_data.event_id
    where event_data.website_id = {websiteId:UUID}
      and event_data.created_at between {startDate:DateTime64} and {endDate:DateTime64}
    order by event_data.created_at desc
    `,v,_),count:p,page:+r,pageSize:o}}e.s(["getEventData",0,o]),a()}catch(e){a(e)}},!1),767591,e=>e.a(async(t,a)=>{try{var n=e.i(868776),i=e.i(32214),s=e.i(25168),r=e.i(335839),d=e.i(333040),o=e.i(238877),l=e.i(888312),u=t([i,d,o,l]);async function _(e,{params:t}){let a=n.z.object({startAt:n.z.coerce.number().int(),endAt:n.z.coerce.number().int(),...r.filterParams,...r.pagingParams}),{auth:d,query:u,error:v}=await (0,i.parseRequest)(e,a);if(v)return v();let{websiteId:c}=await t;if(!await (0,o.canViewWebsiteSection)(d,c,"events"))return(0,s.unauthorized)();let p=await (0,i.getQueryFilters)(u,c),{data:w,count:b,page:h,pageSize:m}=await (0,l.getEventData)(c,p),f=new Map;for(let{websiteId:e,eventId:t,eventName:a,...n}of w){let i=f.get(t);i||(i={websiteId:e,eventId:t,eventName:a,eventProperties:[]},f.set(t,i)),i.eventProperties.push(n)}return(0,s.json)({data:[...f.values()],count:b,page:h,pageSize:m})}[i,d,o,l]=u.then?(await u)():u,e.s(["GET",0,_]),a()}catch(e){a(e)}},!1),226891,e=>e.a(async(t,a)=>{try{var n=e.i(855839),i=e.i(266102),s=e.i(102273),r=e.i(572461),d=e.i(63995),o=e.i(81494),l=e.i(681640),u=e.i(420735),_=e.i(606917),v=e.i(250674),c=e.i(277766),p=e.i(405785),w=e.i(352698),b=e.i(715428),h=e.i(94999),m=e.i(193695);e.i(687439);var f=e.i(891715),g=e.i(767591),R=t([g]);[g]=R.then?(await R)():R;let E=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/websites/[websiteId]/event-data/route",pathname:"/api/websites/[websiteId]/event-data",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/websites/[websiteId]/event-data/route.ts",nextConfigOutput:"standalone",userland:g,...{}}),{workAsyncStorage:D,workUnitAsyncStorage:A,serverHooks:I}=E;async function y(e,t,a){a.requestMeta&&(0,r.setRequestMeta)(e,a.requestMeta),E.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/websites/[websiteId]/event-data/route";n=n.replace(/\/index$/,"")||"/";let s=await E.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,deploymentId:R,params:y,nextConfig:D,parsedUrl:A,isDraftMode:I,prerenderManifest:C,routerServerContext:T,isOnDemandRevalidate:x,revalidateOnlyGenerated:P,resolvedPathname:S,clientReferenceManifest:N,serverActionsManifest:U}=s,q=(0,l.normalizeAppPath)(n),O=!!(C.dynamicRoutes[q]||C.routes[S]),$=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,A,!1):t.end("This page could not be found"),null);if(O&&!I){let e=!!C.routes[S],t=C.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(D.adapterPath)return await $();throw new m.NoFallbackError}}let j=null;!O||E.isDev||I||(j=S,j="/index"===j?"/":j);let k=!0===E.isDev||!O,H=O&&!k;U&&N&&(0,o.setManifestsSingleton)({page:n,clientReferenceManifest:N,serverActionsManifest:U});let M=e.method||"GET",F=(0,d.getTracer)(),K=F.getActiveScopeSpan(),V=!!(null==T?void 0:T.isWrappedByNextServer),z=!!(0,r.getRequestMeta)(e,"minimalMode"),L=(0,r.getRequestMeta)(e,"incrementalCache")||await E.getIncrementalCache(e,D,C,z);null==L||L.resetRequestCache(),globalThis.__incrementalCache=L;let B={params:y,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:k,incrementalCache:L,cacheLifeProfiles:D.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,i)=>E.onRequestError(e,t,n,i,T)},sharedContext:{buildId:g,deploymentId:R}},G=new u.NodeNextRequest(e),W=new u.NodeNextResponse(t),X=_.NextRequestAdapter.fromNodeNextRequest(G,(0,_.signalFromNodeResponse)(t));try{let s,r=async e=>E.handle(X,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==v.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=a.get("next.route");if(i){let t=`${M} ${i}`;e.setAttributes({"next.route":i,"http.route":i,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",i),s.updateName(t))}else e.updateName(`${M} ${n}`)}),o=async s=>{var d,o;let l=async({previousCacheEntry:i})=>{try{if(!z&&x&&P&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await r(s);e.fetchMetrics=B.renderOpts.fetchMetrics;let d=B.renderOpts.pendingWaitUntil;d&&a.waitUntil&&(a.waitUntil(d),d=void 0);let o=B.renderOpts.collectedTags;if(!O)return await (0,p.sendResponse)(G,W,n,B.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,w.toNodeOutgoingHttpHeaders)(n.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,i=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:i}}}}catch(t){throw(null==i?void 0:i.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:x})},!1,T),t}},u=await E.handleResponse({req:e,nextConfig:D,cacheKey:j,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:P,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:z});if(!O)return null;if((null==u||null==(d=u.value)?void 0:d.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(o=u.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});z||t.setHeader("x-nextjs-cache",x?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let _=(0,w.fromNodeOutgoingHttpHeaders)(u.value.headers);return z&&O||_.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||_.get("Cache-Control")||_.set("Cache-Control",(0,b.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(G,W,new Response(u.value.body,{headers:_,status:u.value.status||200})),null};V&&K?await o(K):(s=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(v.BaseServerSpan.handleRequest,{spanName:`${M} ${n}`,kind:d.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},o),void 0,!V))}catch(t){if(t instanceof m.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:x})},!1,T),O)throw t;return await (0,p.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,y,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:A})},"routeModule",0,E,"serverHooks",0,I,"workAsyncStorage",0,D,"workUnitAsyncStorage",0,A]),a()}catch(e){a(e)}},!1),916005,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_node_buffer_0063pbu._.js"].map(t=>e.l(t))).then(()=>t(951615)))},699633,e=>{e.v(t=>Promise.all(["server/chunks/[externals]_@prisma_client_runtime_query_compiler_fast_bg_postgresql_mjs_109us0s._.js"].map(t=>e.l(t))).then(()=>t(813930)))},795459,e=>{e.v(t=>Promise.all(["server/chunks/0q_8_client_runtime_query_compiler_fast_bg_postgresql_wasm-base64_mjs_0x2zncr._.js"].map(t=>e.l(t))).then(()=>t(11470)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ad99kl._.js.map