import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();
const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'16kb'}));
const allowOrigins=(process.env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin(origin,cb){if(!origin||allowOrigins.includes('*')||allowOrigins.includes(origin))return cb(null,true);return cb(new Error('Origin not allowed'));}}));
app.use('/api',rateLimit({windowMs:60_000,max:Number(process.env.RATE_LIMIT_PER_MIN||15),standardHeaders:true,legacyHeaders:false}));
const token=process.env.APIFY_TOKEN;
const config={
 brico:process.env.APIFY_ACTOR_BRICO||'studio-amba/brico-scraper',
 hubo:process.env.APIFY_ACTOR_HUBO||'studio-amba/hubo-scraper',
 gamma:process.env.APIFY_ACTOR_GAMMA||'studio-amba/gamma-scraper',
 hornbach:process.env.APIFY_ACTOR_HORNBACH||''
};
const enabled=Object.entries(config).filter(([k,v])=>v&&token&&!(k==='hornbach'&&!process.env.APIFY_ACTOR_HORNBACH_BE_CONFIRMED)).map(([k])=>k);
const cache=new Map();
app.get('/api/health',(req,res)=>res.json({ok:true,enabledStores:enabled,tokenConfigured:Boolean(token),note:'Live sources are third-party actor integrations and must be reviewed for terms and country coverage.'}));
function normalize(raw,store){const name=raw.name||raw.title||raw.productTitle||raw.product_name||raw.productName;const priceRaw=raw.price??raw.currentPrice??raw.priceValue??raw.amount;const price=typeof priceRaw==='number'?priceRaw:priceRaw==null?null:Number(String(priceRaw).replace(/[^0-9,.-]/g,'').replace(',','.'));const url=raw.url||raw.productUrl||raw.link||raw.product_url;const stock=raw.inStock??raw.available??raw.stockStatus;const date=raw.scrapedAt||raw.updatedAt||raw.lastUpdated||new Date().toISOString();return {name,price:Number.isFinite(price)?price:null,url,store,source:'Apify actor (community)',scrapedAt:date,inStock:typeof stock==='boolean'?stock:undefined,imageUrl:raw.imageUrl||raw.image||raw.image_url||undefined,brand:raw.brand||undefined};}
app.get('/api/search',async(req,res)=>{const q=String(req.query.q||'').trim();if(q.length<2||q.length>120)return res.status(400).json({error:'Căutarea trebuie să aibă 2–120 caractere.'});if(!token)return res.status(503).json({error:'APIFY_TOKEN nu este configurat pe backend.'});const stores=(req.query.store?String(req.query.store).split(','):enabled).map(s=>s.trim().toLowerCase()).filter(s=>enabled.includes(s));if(!stores.length)return res.json({results:[],message:'Nu există surse configurate/active.'});const cacheKey=stores.join(',')+'|'+q.toLowerCase();const cached=cache.get(cacheKey);if(cached&&Date.now()-cached.time<60_000)return res.json({results:cached.results,cached:true});
 const calls=stores.map(async store=>{const actor=config[store];if(!actor)return [];const actorPath=actor.replace('/','~');const inputs={searchQuery:q,maxResults:Number(process.env.RESULTS_PER_STORE||5),language:'nl'};const url=`https://api.apify.com/v2/acts/${encodeURIComponent(actorPath)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=60`;const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),65_000);try{const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(inputs),signal:controller.signal});if(!r.ok)throw new Error(`Actor ${store} returned ${r.status}`);const items=await r.json();return Array.isArray(items)?items.map(x=>normalize(x,store)).filter(x=>x.name&&x.price!=null):[]}catch(e){return {store,error:e.message}}finally{clearTimeout(timeout)}});
 const raw=await Promise.all(calls);const errors=raw.filter(x=>!Array.isArray(x));const results=raw.flatMap(x=>Array.isArray(x)?x:[]).slice(0,25);cache.set(cacheKey,{time:Date.now(),results});res.json({results,errors,checkedAt:new Date().toISOString()});});
app.use((err,req,res,next)=>{res.status(403).json({error:err.message||'Request rejected'});});
const port=Number(process.env.PORT||3000);app.listen(port,'0.0.0.0',()=>console.log(`RenovAI backend listening on ${port}`));
