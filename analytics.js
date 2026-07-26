/* Fleet analytics — PostHog, pageviews only.
 *
 * Loaded by every public page (index + case-study-* + project-*). One file rather
 * than an inline snippet per page: the 13 pages are self-contained by design, but
 * they are one *site*, so they share one slug and one config. Same loading idiom
 * as gate.js.
 *
 * Depth is deliberately pageviews-only — autocapture off, no identify(), no custom
 * events. That keeps the data anonymous (no consent banner needed) and the taxonomy
 * clean in the shared "Web Fleet" PostHog project, where `project` separates sites.
 *
 * The phc_ token is a client-side ingest key. It is public by design and is meant
 * to ship in the page — it grants event-write only, no read access.
 */
(function () {
  'use strict';

  // Never report from local dev or a file:// open — this is what filled the
  // existing project with a `localhost:3000` bucket.
  var h = location.hostname;
  if (location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '' || h === '[::1]') return;

  // Official PostHog HTML snippet loader (posthog.com/docs).
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init('phc_oVPCPUJcdtiYuxKVYjnUUZAAfvxgaRfQTbJtifoqZspr', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',        // captures history-change pageviews (the panel SPA)
    person_profiles: 'identified_only',
    autocapture: false             // pageviews only
  });

  // Every event carries which site it came from. This is the canonical fleet key —
  // $host is unreliable (preview URLs, custom domains, nip.io all fragment it).
  posthog.register({ project: 'portfolio-website' });
})();
