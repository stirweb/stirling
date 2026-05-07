!function(){const i=e=>{var i,l=e.split("/")[2];return"www.youtube.com"===l?`<div class="u-py-1">${`<iframe class="vertical-video"  src="${e}" style="width: 100%; height: auto; aspect-ratio: 3/6;" 
          loading="lazy"  title="YouTube video player" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
          encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen=""></iframe>`}</div>`:"www.tiktok.com"===l?`<div class="u-py-1">${i=e,`<iframe loading="lazy" src="${"https://www.tiktok.com/player/v1/"+(i=i.endsWith("/")?i.slice(0,-1):i).split("/")[i.split("/").length-1]}" style="width: 100%; height: auto; aspect-ratio: 3/6;" ></iframe>`}</div>`:"www.instagram.com"===l?`<div class="u-py-1">${`<blockquote class="instagram-media" 
                    data-instgrm-captioned  
                    data-instgrm-permalink="${e}" 
                    data-instgrm-version="14">
                </blockquote>`}</div>`:void 0};var e=document.getElementById("socialwall"),l=socialMediaUrls.filter(e=>""!==e),t=(Math.ceil(l.length),window.innerWidth);const{noOfColumns:a,cellSize:o}=(t=t)<=640?{noOfColumns:2,cellSize:"small-6"}:t<=1024?{noOfColumns:3,cellSize:"medium-4"}:{noOfColumns:4,cellSize:"large-3"};var r=Math.ceil(l.length/a),s=[];for(let e=0;e<a;e++)s.push(l.slice(e*r,(e+1)*r));t=s.map(e=>`<div class="cell ${o} u-padding-bottom">${e.map(i).join("")}</div>`);e.innerHTML=""+t.join("")}();