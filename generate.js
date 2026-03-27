#!/usr/bin/env node
/**
 * Nathan Bingle Photography - V3 static page generator
 *
 * Usage:
 *   node generate.js
 *
 * Output:
 *   ./output/<slug>.html for each target in TARGETS.
 */

const fs = require("fs");
const path = require("path");

/**
 * Data format (one object per school/league target):
 * {
 *   school: "Fort Mill High School",
 *   city: "Fort Mill, SC",
 *   district: "Fort Mill SD",
 *   slug: "fort-mill-high-school-photography",
 *   seoKeyword: "Fort Mill High School photography"
 * }
 *
 * TODO: Replace this starter array with your full 53-target list.
 */
const TARGETS = [
  { school: "Fort Mill High School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "fort-mill-high-school", seoKeyword: "school photographer Fort Mill SC" },
  { school: "Nation Ford High School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "nation-ford-high-school", seoKeyword: "school photographer Nation Ford Fort Mill" },
  { school: "Catawba Ridge High School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "catawba-ridge-high-school", seoKeyword: "school photographer Catawba Ridge Fort Mill" },
  { school: "Fort Mill Middle School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "fort-mill-middle-school", seoKeyword: "middle school photographer Fort Mill SC" },
  { school: "Springfield Middle School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "springfield-middle-school", seoKeyword: "school photographer Springfield Middle Fort Mill" },
  { school: "Pleasant Knoll Middle School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "pleasant-knoll-middle-school", seoKeyword: "school photographer Pleasant Knoll Fort Mill" },
  { school: "Banks Trail Middle School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "banks-trail-middle-school", seoKeyword: "school photographer Banks Trail Fort Mill" },
  { school: "Forest Creek Middle School", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "forest-creek-middle-school", seoKeyword: "school photographer Forest Creek Fort Mill" },
  { school: "Fort Mill Youth Soccer", city: "Fort Mill, SC", district: "Fort Mill SD", slug: "fort-mill-youth-soccer", seoKeyword: "youth sports photographer Fort Mill soccer" },
  { school: "Rock Hill High School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "rock-hill-high-school", seoKeyword: "school photographer Rock Hill SC" },
  { school: "South Pointe High School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "south-pointe-high-school", seoKeyword: "school photographer South Pointe Rock Hill" },
  { school: "North Rock Hill High School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "north-rock-hill-high-school", seoKeyword: "school photographer North Rock Hill SC" },
  { school: "Rawlinson Road Middle School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "rawlinson-road-middle", seoKeyword: "school photographer Rawlinson Road Rock Hill" },
  { school: "Saluda Trail Middle School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "saluda-trail-middle", seoKeyword: "school photographer Saluda Trail Rock Hill" },
  { school: "Cloverdale Middle School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "cloverdale-middle", seoKeyword: "school photographer Cloverdale Rock Hill" },
  { school: "Westview Middle School", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "westview-middle", seoKeyword: "school photographer Westview Rock Hill" },
  { school: "Rock Hill Youth Basketball", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "rock-hill-youth-basketball", seoKeyword: "youth sports photographer Rock Hill basketball" },
  { school: "Rock Hill Select Basketball", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "rock-hill-select-basketball", seoKeyword: "youth basketball team photos Rock Hill SC" },
  { school: "Rock Hill Swim Club", city: "Rock Hill, SC", district: "Rock Hill SD", slug: "rock-hill-swim-club", seoKeyword: "swim team photos Rock Hill SC" },
  { school: "Clover High School", city: "Clover, SC", district: "Clover SD", slug: "clover-high-school", seoKeyword: "school photographer Clover SC" },
  { school: "Clover Middle School", city: "Clover, SC", district: "Clover SD", slug: "clover-middle-school", seoKeyword: "school photographer Clover Middle SC" },
  { school: "Lake Wylie Middle School", city: "Lake Wylie, SC", district: "Clover SD", slug: "lake-wylie-middle", seoKeyword: "school photographer Lake Wylie SC" },
  { school: "Oak Ridge Middle School", city: "Clover, SC", district: "Clover SD", slug: "oak-ridge-middle-clover", seoKeyword: "school photographer Oak Ridge Clover SC" },
  { school: "Clover Youth Sports", city: "Clover, SC", district: "Clover SD", slug: "clover-youth-sports", seoKeyword: "youth sports photographer Clover SC" },
  { school: "Indian Land High School", city: "Indian Land, SC", district: "Indian Land SD", slug: "indian-land-high-school", seoKeyword: "school photographer Indian Land SC" },
  { school: "Indian Land Middle School", city: "Indian Land, SC", district: "Indian Land SD", slug: "indian-land-middle", seoKeyword: "school photographer Indian Land Middle SC" },
  { school: "Indian Land Youth Soccer", city: "Indian Land, SC", district: "Indian Land SD", slug: "indian-land-youth-soccer", seoKeyword: "youth soccer photos Indian Land SC" },
  { school: "York Comprehensive High School", city: "York, SC", district: "York County", slug: "york-comprehensive-high", seoKeyword: "school photographer York SC" },
  { school: "York Middle School", city: "York, SC", district: "York County", slug: "york-middle-school", seoKeyword: "school photographer York SC middle school" },
  { school: "Sharon Middle School", city: "Sharon, SC", district: "York County", slug: "sharon-middle", seoKeyword: "school photographer Sharon York County SC" },
  { school: "York County Parks and Rec", city: "York, SC", district: "York County", slug: "york-county-parks-rec", seoKeyword: "youth sports photographer York County SC" },
  { school: "York County Youth Soccer", city: "York, SC", district: "York County", slug: "york-county-youth-soccer", seoKeyword: "youth soccer team photos York SC" },
  { school: "York County Youth Football", city: "York, SC", district: "York County", slug: "york-county-youth-football", seoKeyword: "youth football photos York SC" },
  { school: "Myers Park High School", city: "Charlotte, NC", district: "CMS", slug: "myers-park-high-school", seoKeyword: "school photographer Myers Park Charlotte NC" },
  { school: "South Mecklenburg High School", city: "Charlotte, NC", district: "CMS", slug: "south-mecklenburg-high", seoKeyword: "school photographer South Mecklenburg Charlotte" },
  { school: "Providence High School", city: "Charlotte, NC", district: "CMS", slug: "providence-high-school", seoKeyword: "school photographer Providence High Charlotte NC" },
  { school: "Ardrey Kell High School", city: "Charlotte, NC", district: "CMS", slug: "ardrey-kell-high-school", seoKeyword: "school photographer Ardrey Kell Charlotte" },
  { school: "Ballantyne Area Schools", city: "Charlotte, NC", district: "CMS", slug: "ballantyne-school-photographer", seoKeyword: "school photographer Ballantyne Charlotte NC" },
  { school: "Pineville Area Schools", city: "Pineville, NC", district: "CMS", slug: "pineville-school-photographer", seoKeyword: "school photographer Pineville NC" },
  { school: "South Charlotte Youth Soccer", city: "Charlotte, NC", district: "CMS", slug: "south-charlotte-youth-soccer", seoKeyword: "youth soccer team photos south Charlotte NC" },
  { school: "CMS Youth Basketball", city: "Charlotte, NC", district: "CMS", slug: "cms-youth-basketball", seoKeyword: "youth basketball photos Charlotte NC" },
  { school: "Charlotte Youth Football", city: "Charlotte, NC", district: "CMS", slug: "charlotte-youth-football", seoKeyword: "youth football team photos Charlotte NC" },
  { school: "Fort Mill Sports Photography", city: "Fort Mill, SC", district: "All", slug: "sports-photography-fort-mill", seoKeyword: "sports photographer Fort Mill SC" },
  { school: "Rock Hill Sports Photography", city: "Rock Hill, SC", district: "All", slug: "sports-photography-rock-hill", seoKeyword: "sports photographer Rock Hill SC" },
  { school: "Charlotte Sports Photography", city: "Charlotte, NC", district: "All", slug: "sports-photography-charlotte", seoKeyword: "sports photographer Charlotte NC" },
  { school: "School Picture Day Fort Mill", city: "Fort Mill, SC", district: "All", slug: "school-picture-day-fort-mill", seoKeyword: "school picture day photographer Fort Mill SC" },
  { school: "School Picture Day Rock Hill", city: "Rock Hill, SC", district: "All", slug: "school-picture-day-rock-hill", seoKeyword: "school picture day photographer Rock Hill SC" },
  { school: "School Picture Day Charlotte", city: "Charlotte, NC", district: "All", slug: "school-picture-day-charlotte", seoKeyword: "school picture day photographer Charlotte NC" },
  { school: "Media Day Photography Fort Mill", city: "Fort Mill, SC", district: "All", slug: "media-day-photographer-fort-mill", seoKeyword: "media day photographer Fort Mill SC" },
  { school: "Media Day Photography Charlotte", city: "Charlotte, NC", district: "All", slug: "media-day-photographer-charlotte", seoKeyword: "media day photographer Charlotte NC" },
  { school: "Youth Sports Photographer Charlotte", city: "Charlotte, NC", district: "All", slug: "youth-sports-photographer-charlotte", seoKeyword: "youth sports photographer Charlotte NC" },
  { school: "Youth Sports Photographer Fort Mill", city: "Fort Mill, SC", district: "All", slug: "youth-sports-photographer-fort-mill", seoKeyword: "youth sports photographer Fort Mill SC" },
  { school: "Nathan Bingle Photography", city: "Fort Mill, SC", district: "All", slug: "nathan-bingle-photography", seoKeyword: "Nathan Bingle Photography Fort Mill SC" },
];

const OUTPUT_DIR = path.join(__dirname, "output");

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeSlug(slug) {
  return String(slug)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function validateTarget(target, index) {
  const required = ["school", "city", "district", "slug", "seoKeyword"];
  for (const key of required) {
    if (!target[key] || typeof target[key] !== "string") {
      throw new Error(`Target #${index + 1} missing valid "${key}"`);
    }
  }
}

function pageTemplate(target) {
  const school = escapeHtml(target.school);
  const city = escapeHtml(target.city);
  const district = escapeHtml(target.district);
  const seoKeyword = escapeHtml(target.seoKeyword);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${seoKeyword} | Nathan Bingle Photography</title>
  <meta name="description" content="Premium school photography for ${school} in ${city}. Nathan Bingle Photography delivers zero-chaos picture day operations, 90%+ participation, 48-hour turnaround, and transparent revenue share." />
  <meta name="keywords" content="${seoKeyword}, school photographer ${city}, ${district} school photos, Nathan Bingle Photography" />
  <meta property="og:title" content="${seoKeyword} | Nathan Bingle Photography" />
  <meta property="og:description" content="Zero-chaos school photography with 90%+ participation and 48-hour turnaround in ${city}." />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    :root { --bg:#090e16; --bg-elev:#101826; --text:#edf2ff; --muted:#9eabc5; --gold:#e8a020; --line:rgba(255,255,255,.12); --radius:18px; --maxw:1240px; }
    * { box-sizing:border-box; margin:0; padding:0; }
    html, body { width:100%; min-height:100%; background:radial-gradient(1200px 680px at 20% -12%, #273654 0, transparent 52%), radial-gradient(900px 480px at 88% -20%, #2f220f 0, transparent 45%), var(--bg); color:var(--text); font-family:"DM Sans",system-ui,-apple-system,sans-serif; overflow-x:hidden; scroll-behavior:smooth; }
    .container { width:min(calc(100% - 2rem), var(--maxw)); margin:0 auto; }
    h1,h2,h3,.eyebrow,.num { font-family:"Barlow Condensed", Impact, sans-serif; letter-spacing:.03em; text-transform:uppercase; line-height:1; }
    .eyebrow { color:var(--gold); font-size:.9rem; font-weight:700; margin-bottom:.85rem; display:inline-block; }
    .topbar { position:fixed; top:0; left:0; right:0; z-index:50; background:linear-gradient(to bottom, rgba(9,14,22,.88), rgba(9,14,22,.3)); border-bottom:1px solid rgba(255,255,255,.06); backdrop-filter:blur(6px); }
    .topbar-inner { width:min(calc(100% - 2rem), var(--maxw)); margin:0 auto; padding:.85rem 0; display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .brand strong { display:block; font-family:"Barlow Condensed",sans-serif; letter-spacing:.04em; font-size:1.15rem; }
    .brand small { color:var(--muted); text-transform:uppercase; letter-spacing:.05em; font-size:.74rem; }
    .pill-btn { color:var(--text); text-decoration:none; border:1px solid rgba(232,160,32,.8); border-radius:999px; padding:.5rem .95rem; font-size:.84rem; }
    .hero { min-height:100svh; display:grid; align-items:end; position:relative; border-bottom:1px solid var(--line); isolation:isolate; overflow:hidden; }
    .hero::before { content:""; position:absolute; inset:-25% -25%; z-index:-2; background:radial-gradient(circle at 20% 30%, rgba(232,160,32,.2) 0, transparent 28%), radial-gradient(circle at 80% 28%, rgba(103,142,255,.2) 0, transparent 24%), radial-gradient(circle at 52% 76%, rgba(66,81,116,.32) 0, transparent 30%); filter:blur(24px); animation:spin 28s linear infinite; transform-origin:center; }
    .hero::after { content:""; position:absolute; inset:0; z-index:-1; background-image:linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size:42px 42px; opacity:.16; }
    @keyframes spin { from{transform:rotate(0) scale(1)} 50%{transform:rotate(180deg) scale(1.05)} to{transform:rotate(360deg) scale(1)} }
    .hero-inner { width:min(calc(100% - 2rem), var(--maxw)); margin:0 auto; padding:clamp(5.2rem,9vw,7.4rem) 0 clamp(2.1rem,5vw,3.2rem); display:grid; gap:1.2rem 1.5rem; grid-template-columns:1.2fr .8fr; align-items:end; }
    .hero-copy h1 { font-size:clamp(2.4rem,7vw,6.6rem); line-height:.91; max-width:10.5ch; overflow:hidden; }
    .line { display:block; transform:translateY(120%); opacity:0; animation:up .88s cubic-bezier(.22,.7,.16,1) forwards; }
    .line:nth-child(2){animation-delay:.18s} .line:nth-child(3){animation-delay:.34s}
    @keyframes up { to { transform:translateY(0); opacity:1; } }
    .hero-copy p { color:var(--muted); max-width:56ch; margin-top:1.2rem; font-size:1.04rem; }
    .hero-card { border:1px solid var(--line); border-radius:var(--radius); background:linear-gradient(160deg, rgba(16,24,38,.88), rgba(18,29,44,.88)); padding:1.1rem; box-shadow:0 30px 60px rgba(0,0,0,.45); }
    section { padding:clamp(3.5rem,6vw,6.2rem) 0; }
    .section-title { font-size:clamp(2rem,5vw,3.5rem); margin-bottom:.85rem; }
    .section-intro { color:var(--muted); max-width:62ch; margin-bottom:1.8rem; }
    .fade { opacity:0; transform:translateY(24px); transition:opacity .7s ease, transform .7s ease; }
    .fade.show { opacity:1; transform:translateY(0); }
    .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
    .stat { border:1px solid var(--line); background:linear-gradient(160deg, rgba(255,255,255,.02), rgba(15,22,34,.65)); border-radius:14px; padding:1rem 1rem 1.1rem; text-align:center; }
    .num { display:block; color:var(--gold); font-size:clamp(2.1rem,4vw,3.6rem); margin-bottom:.3rem; }
    .label { color:var(--muted); text-transform:uppercase; letter-spacing:.05em; font-size:.82rem; }
    .cards { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
    .card { border:1px solid var(--line); border-radius:var(--radius); background:linear-gradient(160deg, #131d2d 0%, #0f1725 100%); padding:1.35rem; transition:transform .24s ease, border-color .24s ease; }
    .card:hover { transform:translateY(-7px); border-color:rgba(232,160,32,.45); }
    .chip { display:inline-block; font-size:.71rem; text-transform:uppercase; letter-spacing:.07em; padding:.17rem .55rem; border-radius:999px; color:#1f1506; background:var(--gold); margin-bottom:.75rem; font-weight:700; }
    .card h3 { font-size:1.78rem; margin-bottom:.55rem; }
    .card p { color:var(--muted); margin-bottom:.65rem; }
    .card ul { list-style:none; display:grid; gap:.4rem; color:#c0c9de; font-size:.94rem; }
    .card li::before { content:"•"; color:var(--gold); margin-right:.45rem; }
    .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
    .step { border:1px solid var(--line); background:rgba(255,255,255,.015); border-radius:14px; padding:1.1rem; }
    .step .index { color:var(--gold); font-family:"Barlow Condensed",sans-serif; font-size:2rem; margin-bottom:.35rem; display:inline-block; }
    .step h3 { font-size:1.33rem; margin-bottom:.4rem; }
    .step p { color:var(--muted); font-size:.95rem; }
    .testimonials { display:grid; grid-template-columns:1.12fr .88fr; gap:1rem; }
    .quote,.proof { border:1px solid var(--line); border-radius:var(--radius); padding:clamp(1.2rem,2.7vw,1.9rem); background:linear-gradient(145deg, rgba(255,255,255,.022), rgba(255,255,255,.008)); }
    .quote .mark { color:var(--gold); font-size:3rem; line-height:.7; font-family:"Barlow Condensed",sans-serif; }
    blockquote { margin-top:.6rem; font-size:1.08rem; max-width:58ch; }
    .author { margin-top:1rem; color:var(--muted); font-size:.92rem; }
    .proof h3 { font-size:1.46rem; margin-bottom:.45rem; }
    .proof p { color:var(--muted); }
    .cta-wrap { padding-bottom:clamp(4rem,8vw,6rem); }
    .cta { border:1px solid rgba(232,160,32,.45); border-radius:calc(var(--radius) + 1px); background:linear-gradient(160deg, rgba(20,31,48,.95), rgba(13,21,33,.98)); box-shadow:0 24px 60px rgba(0,0,0,.38); padding:clamp(1.25rem,4vw,2.3rem); display:grid; grid-template-columns:1fr auto; gap:1.1rem; align-items:center; }
    .cta h2 { font-size:clamp(2rem,5vw,3.2rem); margin-bottom:.45rem; }
    .cta p { color:var(--muted); max-width:56ch; }
    .form { display:flex; gap:.6rem; flex-wrap:wrap; justify-content:flex-end; align-items:center; }
    .form input { min-width:235px; padding:.82rem .95rem; border-radius:11px; border:1px solid var(--line); background:rgba(7,11,17,.92); color:var(--text); font:inherit; outline:none; }
    .form button { border:0; border-radius:11px; background:var(--gold); color:#1a1305; font-family:"Barlow Condensed",sans-serif; text-transform:uppercase; letter-spacing:.04em; font-size:1rem; padding:.82rem 1.15rem; cursor:pointer; }
    .foot { text-align:center; color:var(--muted); font-size:.84rem; padding:1rem 0 2rem; }
    @media (max-width:1020px){ .hero-inner,.testimonials,.cta{grid-template-columns:1fr} .stats{grid-template-columns:repeat(2,1fr)} .cards,.steps{grid-template-columns:repeat(2,1fr)} .form{justify-content:flex-start} }
    @media (max-width:640px){ .stats,.cards,.steps{grid-template-columns:1fr} .hero-copy h1{max-width:100%} .topbar-inner,.hero-inner,.container{width:min(calc(100% - 1.2rem), var(--maxw))} .pill-btn{display:none} .form input,.form button{width:100%} }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <strong>Nathan Bingle Photography</strong>
        <small>${city} School Photography</small>
      </div>
      <a href="#proposal" class="pill-btn">Request School Proposal</a>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">${school} | ${district}</span>
          <h1>
            <span class="line">Cutting-Edge</span>
            <span class="line">School Photos,</span>
            <span class="line">Zero Day-Of Chaos</span>
          </h1>
          <p>
            Nathan Bingle Photography delivers a cinematic-quality portrait program for
            ${school} in ${city}, combining fast operations, family-first communication,
            and revenue-positive results for your school.
          </p>
        </div>
        <aside class="hero-card">
          <h3>${district} Program Snapshot</h3>
          <p>Locally based team. 90%+ participation framework. 48-hour delivery standard. Transparent revenue share model.</p>
        </aside>
      </div>
    </section>
    <section class="fade">
      <div class="container">
        <span class="eyebrow">School Performance Metrics</span>
        <h2 class="section-title">Numbers That Matter To Administrators</h2>
        <p class="section-intro">Every detail is optimized for less staff friction, stronger parent response, and a better picture day experience.</p>
        <div class="stats">
          <article class="stat"><span class="num" data-count="90" data-suffix="%">0%</span><p class="label">Participation Rate</p></article>
          <article class="stat"><span class="num" data-count="48" data-suffix="hr">0hr</span><p class="label">Turnaround Time</p></article>
          <article class="stat"><span class="num" data-count="0">0</span><p class="label">Picture Day Chaos</p></article>
          <article class="stat"><span class="num" data-count="100" data-suffix="%">0%</span><p class="label">Revenue Share Clarity</p></article>
        </div>
      </div>
    </section>
    <section class="fade">
      <div class="container">
        <span class="eyebrow">Photo Program Packages</span>
        <h2 class="section-title">Built For ${school} Goals</h2>
        <p class="section-intro">Start lean or deploy full partnership support. Each package is designed to increase outcomes while reducing day-of stress for staff.</p>
        <div class="cards">
          <article class="card"><span class="chip">Starter</span><h3>Starter</h3><p>Best for schools seeking a polished, reliable upgrade without complexity.</p><ul><li>Picture day logistics plan</li><li>Family ordering portal</li><li>Core portrait workflow</li><li>Admin support desk</li></ul></article>
          <article class="card"><span class="chip">Premier</span><h3>Premier</h3><p>Our most requested package for high participation and rapid image delivery.</p><ul><li>90%+ participation strategy</li><li>48-hour gallery turnaround</li><li>Optimized retake process</li><li>Dedicated on-site lead</li></ul></article>
          <article class="card"><span class="chip">Program Partner</span><h3>Program Partner</h3><p>Long-term growth partnership with transparent revenue share alignment.</p><ul><li>Customized revenue model</li><li>District-ready communications</li><li>Multi-event support strategy</li><li>Quarterly review cadence</li></ul></article>
        </div>
      </div>
    </section>
    <section class="fade">
      <div class="container">
        <span class="eyebrow">Execution Framework</span>
        <h2 class="section-title">4 Steps To A Better Picture Day</h2>
        <div class="steps">
          <article class="step"><span class="index">01</span><h3>Align</h3><p>We map your calendar, traffic flow, and goals across district constraints.</p></article>
          <article class="step"><span class="index">02</span><h3>Mobilize</h3><p>Families get clear messaging and staff get a simple plan with zero confusion.</p></article>
          <article class="step"><span class="index">03</span><h3>Capture</h3><p>Fast stations and clean direction keep lines moving while preserving quality.</p></article>
          <article class="step"><span class="index">04</span><h3>Deliver</h3><p>Images launch in 48 hours with support, reporting, and transparent outcomes.</p></article>
        </div>
      </div>
    </section>
    <section class="fade">
      <div class="container">
        <span class="eyebrow">School Leader Feedback</span>
        <h2 class="section-title">Trusted In ${city}</h2>
        <div class="testimonials">
          <article class="quote"><span class="mark">"</span><blockquote>Nathan made this the first picture day that felt fully under control from start to finish. Participation jumped, parents were happier, and our staff had bandwidth to focus on students instead of logistics.</blockquote><p class="author">Operations Administrator, ${district}</p></article>
          <aside class="proof"><h3>Local Partner Advantage</h3><p>Nathan Bingle Photography combines premium portrait quality with school-ready systems built for district expectations and real-world timelines.</p></aside>
        </div>
      </div>
    </section>
    <section class="cta-wrap fade" id="proposal">
      <div class="container">
        <div class="cta">
          <div>
            <span class="eyebrow">Launch The Next Picture Day</span>
            <h2>Get A ${school} Proposal</h2>
            <p>Share your school email and get a customized plan with timelines, package fit, and revenue share options built for your community.</p>
          </div>
          <form class="form" action="#" method="post">
            <input name="email" type="email" placeholder="Your school email" required />
            <button type="submit">Request Proposal</button>
          </form>
        </div>
      </div>
    </section>
  </main>
  <p class="foot">Serving ${school} | ${city} | ${district}</p>
  <script>
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll(".fade").forEach((el) => revealObs.observe(el));
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.done === "1") return;
        el.dataset.done = "1";
        const target = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const dur = 1200;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const v = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          el.textContent = v + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    }, { threshold: 0.55 });
    document.querySelectorAll(".num").forEach((n) => countObs.observe(n));
  </script>
</body>
</html>`;
}

function indexTemplate(targets) {
  const items = targets
    .map((target) => {
      const slug = sanitizeSlug(target.slug);
      const school = escapeHtml(target.school);
      const city = escapeHtml(target.city);
      const district = escapeHtml(target.district);
      const keyword = escapeHtml(target.seoKeyword);
      return `<li><a href="./${slug}.html">${school}</a><span>${city} | ${district} | ${keyword}</span></li>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nathan Bingle Photography | Generated SEO Pages</title>
  <style>
    :root { --bg:#0b1018; --card:#121b2a; --text:#ecf2ff; --muted:#9fb0cf; --gold:#e8a020; --line:rgba(255,255,255,.12); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, -apple-system, sans-serif; color: var(--text); background: radial-gradient(800px 500px at 10% -10%, #263654 0, transparent 50%), var(--bg); }
    .wrap { width:min(100% - 2rem, 1000px); margin:2rem auto; }
    h1 { margin: 0 0 .4rem; font-size: 1.8rem; }
    p { margin: 0 0 1.2rem; color: var(--muted); }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .6rem; }
    li { border: 1px solid var(--line); border-radius: 10px; padding: .75rem .9rem; background: var(--card); display: grid; gap: .2rem; }
    a { color: var(--gold); text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    span { color: var(--muted); font-size: .9rem; }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>Nathan Bingle Photography - SEO Landing Pages</h1>
    <p>Total generated pages: ${targets.length}</p>
    <ul>
      ${items}
    </ul>
  </main>
</body>
</html>`;
}

function run() {
  if (!Array.isArray(TARGETS) || TARGETS.length === 0) {
    throw new Error("TARGETS must be a non-empty array.");
  }

  try {
    fs.mkdirSync(OUTPUT_DIR);
  } catch (err) {
    if (!err || err.code !== "EEXIST") {
      throw err;
    }
  }

  // Remove previously generated HTML files so each run is deterministic.
  fs.readdirSync(OUTPUT_DIR).forEach((name) => {
    if (/\.html$/i.test(name)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, name));
    }
  });

  const usedSlugs = new Set();
  let created = 0;

  TARGETS.forEach((target, i) => {
    validateTarget(target, i);

    const slug = sanitizeSlug(target.slug);
    if (!slug) throw new Error(`Target #${i + 1} has invalid slug "${target.slug}"`);
    if (usedSlugs.has(slug)) throw new Error(`Duplicate slug "${slug}" at target #${i + 1}`);
    usedSlugs.add(slug);

    const html = pageTemplate(target);
    const outPath = path.join(OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outPath, html, "utf8");
    created += 1;
  });

  const indexPath = path.join(OUTPUT_DIR, "index.html");
  fs.writeFileSync(indexPath, indexTemplate(TARGETS), "utf8");

  console.log(`Generated ${created} page(s) in ${OUTPUT_DIR}`);
}

run();
