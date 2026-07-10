module.exports=[377970,e=>e.a(async(t,n)=>{try{var r=e.i(81862),a=e.i(843793),i=e.i(698043),p=t([i]);async function s(...e){return(0,a.runQuery)({[a.PRISMA]:()=>o(...e),[a.CLICKHOUSE]:()=>c(...e)})}async function o(e,t,n){let{startDate:r,endDate:a,unit:p="day",timezone:s="utc",metric:o="lcp"}=t,{getDateSQL:c,rawQuery:l,parseFilters:u}=i.default,{filterQuery:d,joinSessionQuery:_,cohortQuery:b,queryParams:w}=u({...n,websiteId:e}),f=await l(`
    select
      ${c("website_event.created_at",p,s)} t,
      percentile_cont(0.5) within group (order by ${o}) as p50,
      percentile_cont(0.75) within group (order by ${o}) as p75,
      percentile_cont(0.95) within group (order by ${o}) as p95
    from website_event
    ${b}
    ${_}
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.event_type = 5
      and website_event.created_at between {{startDate}} and {{endDate}}
      ${d}
    group by t
    order by t
    `,{...w,startDate:r,endDate:a}),h=await l(`
    select
      percentile_cont(0.5) within group (order by lcp) as lcp_p50,
      percentile_cont(0.75) within group (order by lcp) as lcp_p75,
      percentile_cont(0.95) within group (order by lcp) as lcp_p95,
      percentile_cont(0.5) within group (order by inp) as inp_p50,
      percentile_cont(0.75) within group (order by inp) as inp_p75,
      percentile_cont(0.95) within group (order by inp) as inp_p95,
      percentile_cont(0.5) within group (order by cls) as cls_p50,
      percentile_cont(0.75) within group (order by cls) as cls_p75,
      percentile_cont(0.95) within group (order by cls) as cls_p95,
      percentile_cont(0.5) within group (order by fcp) as fcp_p50,
      percentile_cont(0.75) within group (order by fcp) as fcp_p75,
      percentile_cont(0.95) within group (order by fcp) as fcp_p95,
      percentile_cont(0.5) within group (order by ttfb) as ttfb_p50,
      percentile_cont(0.75) within group (order by ttfb) as ttfb_p75,
      percentile_cont(0.95) within group (order by ttfb) as ttfb_p95,
      count(*) as count
    from website_event
    ${b}
    ${_}
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.event_type = 5
      and website_event.created_at between {{startDate}} and {{endDate}}
      ${d}
    `,{...w,startDate:r,endDate:a}).then(e=>e?.[0]),m={lcp:{p50:Number(h?.lcp_p50||0),p75:Number(h?.lcp_p75||0),p95:Number(h?.lcp_p95||0)},inp:{p50:Number(h?.inp_p50||0),p75:Number(h?.inp_p75||0),p95:Number(h?.inp_p95||0)},cls:{p50:Number(h?.cls_p50||0),p75:Number(h?.cls_p75||0),p95:Number(h?.cls_p95||0)},fcp:{p50:Number(h?.fcp_p50||0),p75:Number(h?.fcp_p75||0),p95:Number(h?.fcp_p95||0)},ttfb:{p50:Number(h?.ttfb_p50||0),p75:Number(h?.ttfb_p75||0),p95:Number(h?.ttfb_p95||0)},count:Number(h?.count||0)};return{chart:f,summary:m}}async function c(e,t,n){let{startDate:a,endDate:i,unit:p="day",timezone:s="utc",metric:o="lcp"}=t,{getDateSQL:c,rawQuery:l,parseFilters:u}=r.default,{filterQuery:d,cohortQuery:_,queryParams:b}=u({...n,websiteId:e}),w=await l(`
    select
      ${c("created_at",p,s)} t,
      quantile(0.5)(${o}) as p50,
      quantile(0.75)(${o}) as p75,
      quantile(0.95)(${o}) as p95
    from website_event
    ${_}
    where website_event.website_id = {websiteId:UUID}
      and website_event.event_type = 5
      and website_event.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ${d}
    group by t
    order by t
    `,{...b,startDate:a,endDate:i}),f=await l(`
    select
      quantile(0.5)(lcp) as lcp_p50,
      quantile(0.75)(lcp) as lcp_p75,
      quantile(0.95)(lcp) as lcp_p95,
      quantile(0.5)(inp) as inp_p50,
      quantile(0.75)(inp) as inp_p75,
      quantile(0.95)(inp) as inp_p95,
      quantile(0.5)(cls) as cls_p50,
      quantile(0.75)(cls) as cls_p75,
      quantile(0.95)(cls) as cls_p95,
      quantile(0.5)(fcp) as fcp_p50,
      quantile(0.75)(fcp) as fcp_p75,
      quantile(0.95)(fcp) as fcp_p95,
      quantile(0.5)(ttfb) as ttfb_p50,
      quantile(0.75)(ttfb) as ttfb_p75,
      quantile(0.95)(ttfb) as ttfb_p95,
      count() as count
    from website_event
    ${_}
    where website_event.website_id = {websiteId:UUID}
      and website_event.event_type = 5
      and website_event.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ${d}
    `,{...b,startDate:a,endDate:i}).then(e=>e?.[0]),h={lcp:{p50:Number(f?.lcp_p50||0),p75:Number(f?.lcp_p75||0),p95:Number(f?.lcp_p95||0)},inp:{p50:Number(f?.inp_p50||0),p75:Number(f?.inp_p75||0),p95:Number(f?.inp_p95||0)},cls:{p50:Number(f?.cls_p50||0),p75:Number(f?.cls_p75||0),p95:Number(f?.cls_p95||0)},fcp:{p50:Number(f?.fcp_p50||0),p75:Number(f?.fcp_p75||0),p95:Number(f?.fcp_p95||0)},ttfb:{p50:Number(f?.ttfb_p50||0),p75:Number(f?.ttfb_p75||0),p95:Number(f?.ttfb_p95||0)},count:Number(f?.count||0)};return{chart:w,summary:h}}[i]=p.then?(await p)():p,e.s(["getPerformance",0,s]),n()}catch(e){n(e)}},!1),542205,e=>e.a(async(t,n)=>{try{var r=e.i(81862),a=e.i(869582),i=e.i(843793),p=e.i(698043),s=t([p]);async function o(...e){return(0,i.runQuery)({[i.PRISMA]:()=>c(...e),[i.CLICKHOUSE]:()=>l(...e)})}async function c(e,t,n,r,i){let{startDate:s,endDate:o,metric:c="lcp"}=t,{rawQuery:l,parseFilters:u}=p.default,{filterQuery:d,joinSessionQuery:_,cohortQuery:b,queryParams:w}=u({...n,websiteId:e},{joinSession:a.SESSION_COLUMNS.includes(r)});return l(`
    select
      ${r} as "name",
      percentile_cont(0.5) within group (order by ${c}) as p50,
      percentile_cont(0.75) within group (order by ${c}) as p75,
      percentile_cont(0.95) within group (order by ${c}) as p95,
      count(*) as count
    from website_event
    ${b}
    ${_}
    where website_event.website_id = {{websiteId::uuid}}
      and website_event.event_type = 5
      and website_event.created_at between {{startDate}} and {{endDate}}
      ${d}
    group by ${r}
    order by p75 desc
    ${i?`limit ${i}`:""}
    `,{...w,startDate:s,endDate:o})}async function l(e,t,n,a,i){let{startDate:p,endDate:s,metric:o="lcp"}=t,{rawQuery:c,parseFilters:l}=r.default,{filterQuery:u,cohortQuery:d,queryParams:_}=l({...n,websiteId:e});return c(`
    select
      ${a} as "name",
      quantile(0.5)(${o}) as p50,
      quantile(0.75)(${o}) as p75,
      quantile(0.95)(${o}) as p95,
      count() as count
    from website_event
    ${d}
    where website_event.website_id = {websiteId:UUID}
      and website_event.event_type = 5
      and website_event.created_at between {startDate:DateTime64} and {endDate:DateTime64}
      ${u}
    group by ${a}
    order by p75 desc
    ${i?`limit ${i}`:""}
    `,{..._,startDate:p,endDate:s})}[p]=s.then?(await s)():s,e.s(["getPerformanceMetrics",0,o]),n()}catch(e){n(e)}},!1),436716,e=>e.a(async(t,n)=>{try{var r=e.i(32214),a=e.i(25168),i=e.i(335839),p=e.i(333040),s=e.i(238877),o=e.i(377970),c=e.i(542205),l=t([r,p,s,o,c]);async function u(e){let{auth:t,body:n,error:p}=await (0,r.parseRequest)(e,i.reportResultSchema);if(p)return p();let{websiteId:l}=n;if(!await (0,s.canViewWebsiteSection)(t,l,"performance"))return(0,a.unauthorized)();let u=await (0,r.setWebsiteDate)(l,n.parameters),d=await (0,r.getQueryFilters)(n.filters,l),[{chart:_,summary:b},w,f,h,m]=await Promise.all([(0,o.getPerformance)(l,u,d),(0,c.getPerformanceMetrics)(l,u,d,"url_path",500),(0,c.getPerformanceMetrics)(l,u,d,"page_title",500),(0,c.getPerformanceMetrics)(l,u,d,"device"),(0,c.getPerformanceMetrics)(l,u,d,"browser",500)]);return(0,a.json)({chart:_,summary:b,pages:w,pageTitles:f,devices:h,browsers:m})}[r,p,s,o,c]=l.then?(await l)():l,e.s(["POST",0,u]),n()}catch(e){n(e)}},!1),6851,e=>e.a(async(t,n)=>{try{var r=e.i(855839),a=e.i(266102),i=e.i(102273),p=e.i(572461),s=e.i(63995),o=e.i(81494),c=e.i(681640),l=e.i(420735),u=e.i(606917),d=e.i(250674),_=e.i(277766),b=e.i(405785),w=e.i(352698),f=e.i(715428),h=e.i(94999),m=e.i(193695);e.i(687439);var v=e.i(891715),y=e.i(436716),g=t([y]);[y]=g.then?(await g)():g;let N=new r.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/reports/performance/route",pathname:"/api/reports/performance",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/reports/performance/route.ts",nextConfigOutput:"standalone",userland:y,...{}}),{workAsyncStorage:$,workUnitAsyncStorage:E,serverHooks:C}=N;async function R(e,t,n){n.requestMeta&&(0,p.setRequestMeta)(e,n.requestMeta),N.isDev&&(0,p.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/reports/performance/route";r=r.replace(/\/index$/,"")||"/";let i=await N.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:y,deploymentId:g,params:R,nextConfig:$,parsedUrl:E,isDraftMode:C,prerenderManifest:q,routerServerContext:D,isOnDemandRevalidate:P,revalidateOnlyGenerated:S,resolvedPathname:A,clientReferenceManifest:T,serverActionsManifest:x}=i,I=(0,c.normalizeAppPath)(r),O=!!(q.dynamicRoutes[I]||q.routes[A]),U=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,E,!1):t.end("This page could not be found"),null);if(O&&!C){let e=!!q.routes[A],t=q.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if($.adapterPath)return await U();throw new m.NoFallbackError}}let M=null;!O||N.isDev||C||(M=A,M="/index"===M?"/":M);let H=!0===N.isDev||!O,k=O&&!H;x&&T&&(0,o.setManifestsSingleton)({page:r,clientReferenceManifest:T,serverActionsManifest:x});let K=e.method||"GET",j=(0,s.getTracer)(),F=j.getActiveScopeSpan(),L=!!(null==D?void 0:D.isWrappedByNextServer),B=!!(0,p.getRequestMeta)(e,"minimalMode"),W=(0,p.getRequestMeta)(e,"incrementalCache")||await N.getIncrementalCache(e,$,q,B);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let V={params:R,previewProps:q.preview,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:H,incrementalCache:W,cacheLifeProfiles:$.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,r,a)=>N.onRequestError(e,t,r,a,D)},sharedContext:{buildId:y,deploymentId:g}},G=new l.NodeNextRequest(e),Q=new l.NodeNextResponse(t),X=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let i,p=async e=>N.handle(X,V).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=j.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=n.get("next.route");if(a){let t=`${K} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${K} ${r}`)}),o=async i=>{var s,o;let c=async({previousCacheEntry:a})=>{try{if(!B&&P&&S&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await p(i);e.fetchMetrics=V.renderOpts.fetchMetrics;let s=V.renderOpts.pendingWaitUntil;s&&n.waitUntil&&(n.waitUntil(s),s=void 0);let o=V.renderOpts.collectedTags;if(!O)return await (0,b.sendResponse)(G,Q,r,V.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,w.toNodeOutgoingHttpHeaders)(r.headers);o&&(t[h.NEXT_CACHE_TAGS_HEADER]=o),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==V.renderOpts.collectedRevalidate&&!(V.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&V.renderOpts.collectedRevalidate,a=void 0===V.renderOpts.collectedExpire||V.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:V.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:P})},!1,D),t}},l=await N.handleResponse({req:e,nextConfig:$,cacheKey:M,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:q,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:S,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:B});if(!O)return null;if((null==l||null==(s=l.value)?void 0:s.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(o=l.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",P?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,w.fromNodeOutgoingHttpHeaders)(l.value.headers);return B&&O||u.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,f.getCacheControlHeader)(l.cacheControl)),await (0,b.sendResponse)(G,Q,new Response(l.value.body,{headers:u,status:l.value.status||200})),null};L&&F?await o(F):(i=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${K} ${r}`,kind:s.SpanKind.SERVER,attributes:{"http.method":K,"http.target":e.url}},o),void 0,!L))}catch(t){if(t instanceof m.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,_.getRevalidateReason)({isStaticGeneration:k,isOnDemandRevalidate:P})},!1,D),O)throw t;return await (0,b.sendResponse)(G,Q,new Response(null,{status:500})),null}}e.s(["handler",0,R,"patchFetch",0,function(){return(0,i.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:E})},"routeModule",0,N,"serverHooks",0,C,"workAsyncStorage",0,$,"workUnitAsyncStorage",0,E]),n()}catch(e){n(e)}},!1)];

//# sourceMappingURL=_0zbss3o._.js.map