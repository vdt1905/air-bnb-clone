import photoManifest from './photos.json' with { type: 'json' };

// Screenshot content is fixed intentionally: live review counts change over time.
export function createMirashyaListing(base) {
  const photo = (room, n = 1) => `/images/mirashya/${room}-${n}.jpg`;
  const hero = [photo('living-room-2',4),photo('living-room-2'),photo('living-room-2',2),photo('bedroom'),photo('exterior',2)];
  const amenities = [
    ['Kitchen','kitchen','Cooking and dining'],['Wifi','wifi','Internet and office'],
    ['Dedicated workspace','desk','Internet and office'],['Free parking on premises','car','Parking and facilities'],
    ['Pool','pool','Parking and facilities'],['Hot tub','bath','Parking and facilities'],
    ['Pets allowed','pet','Services'],['Exterior security cameras on property','camera','Home safety'],
    ['Carbon monoxide alarm','alarm','Not included',false],['Smoke alarm','alarm','Not included',false],
    ['Hairdryer','hairdryer','Bathroom'],['Shampoo','bottle','Bathroom'],['Hot water','droplet','Bathroom'],['Shower gel','bottle','Bathroom'],
    ['Essentials','essentials','Bedroom and laundry'],['Hangers','hanger','Bedroom and laundry'],['Bed linen','bed','Bedroom and laundry'],['Extra pillows and blankets','bed','Bedroom and laundry'],['Iron','iron','Bedroom and laundry'],['Clothes storage','hanger','Bedroom and laundry'],
    ['TV','tv','Entertainment'],['Exercise equipment','gym','Entertainment'],['Air conditioning','snowflake','Heating and cooling'],['Ceiling fan','fan','Heating and cooling'],
    ['Fridge','kitchen','Cooking and dining'],['Microwave','kitchen','Cooking and dining'],['Cooking basics','kitchen','Cooking and dining'],['Dishes and cutlery','kitchen','Cooking and dining'],['Freezer','snowflake','Cooking and dining'],['Cooker','kitchen','Cooking and dining'],['Kettle','kitchen','Cooking and dining'],['Wine glasses','kitchen','Cooking and dining'],['Toaster','kitchen','Cooking and dining'],['Blender','kitchen','Cooking and dining'],['Dining table','desk','Cooking and dining'],
    ['Private entrance','door','Location features'],['Private patio or balcony','balcony','Outdoor'],['Outdoor furniture','desk','Outdoor'],['Outdoor dining area','outdoor','Outdoor'],['Lift','door','Parking and facilities'],['Gym','gym','Parking and facilities'],
    ['Long-term stays allowed','calendarX','Services'],['Self check-in','key','Services'],['Building staff','user','Services'],['Cleaning available during stay','spray','Services'],['Luggage drop-off allowed','essentials','Services'],['Cot','bed','Family'],['Room-darkening blinds','door','Bedroom and laundry'],['First aid kit','essentials','Home safety'],['Fire extinguisher','shield','Home safety'],
  ].map(([label, icon, category, available = true], i) => ({ id:`amenity-${i}`,label,icon,category,available }));
  const reviews = [
    ['Amit','2 months on Airbnb','1 week ago','Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.',null],
    ['Aheesh','3 years on Airbnb','2 weeks ago','We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.','/images/guests/guest-001.webp'],
    ['Samiksha','8 months on Airbnb','May 2026','the host nitish was really great help','/images/guests/guest-003.webp'],
    ['Vedant','4 years on Airbnb','May 2026','We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine. We loved the private jacuzzi and the peaceful location.',null],
    ['Vaibhav S','3 years on Airbnb','May 2026',"Great great experience living out there , can't expect more , will always look for it in the future and will recommend my friends too.",'/images/guests/guest-004.webp'],
    ['Mohd','5 years on Airbnb','May 2026','Great place. Exactly as described in the listing.','/images/guests/guest-005.webp'],
  ].map(([author,tenure,dateLabel,body,avatarUrl],i)=>({id:`r${i+1}`,author,tenure,dateLabel,body,avatarUrl,rating:5,date:'2026-05-20'}));
  return {
    ...base,
    title:'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
    propertyType:'Entire serviced apartment',
    capacity:{guests:3,bedrooms:1,beds:1,bathrooms:1},
    rating:{value:4.95,count:19,isNew:false},
    photos:photoManifest.map((p,i)=>({id:`p${String(i+1).padStart(2,'0')}`,room:p.room,url:p.url,alt:`${p.room} — view ${p.url.match(/-(\d+)\./)?.[1] ?? 1}`,width:1440,height:960,heroOrder:hero.includes(p.url)?hero.indexOf(p.url):null})),
    roomGroups:[
      {name:'Living room 1',details:['Sofa','Air conditioning','Ceiling fan','TV']},
      {name:'Living room 2',details:['Ceiling fan','Hot tub']},
      {name:'Full kitchen',details:['Fridge','Freezer','Cooking basics','Kettle']},
      {name:'Bedroom',details:['1 double bed','Air conditioning','Bed linen','Ceiling fan']},
      {name:'Full bathroom',details:['Hairdryer','Hot water','Shampoo','Shower gel']},
      {name:'Gym',details:['Air conditioning','Exercise equipment','Ceiling fan']},
      {name:'Exterior',details:[]},{name:'Pool',details:['Pool']},{name:'Additional photos',details:[]},
    ],
    host:{...base.host,name:'Mirashya Homes',avatarUrl:'/images/mirashya/host.jpg',monthsHosting:24,reviewCount:1463,rating:4.68},
    highlights:[base.highlights[1],base.highlights[2],base.highlights[0]],
    description:{
      summary:'🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴',
      sections:[{heading:'The space',body:'A bright one-bedroom apartment with a private jacuzzi, a comfortable living room, a fully equipped kitchen and a balcony. Relax with a swim in the shared pool, or spend a quiet evening at home after exploring Candolim.'},{heading:'Guest access',body:'Enjoy the entire apartment and shared access to the gym, parking area and swimming pool.'},{heading:'Other things to note',body:'Pool hours are 9 am to 7 pm. Please respect the quiet residential community. Early check-in and late checkout are subject to availability. Housekeeping is available between 9 am and 6 pm.'}],
    },
    amenities,
    sleepingArrangements:[{name:'Bedroom',beds:['1 double bed'],imageUrl:photo('bedroom')},{name:'Living room',beds:['1 sofa'],imageUrl:photo('living-room-1')}],
    pricing:{nightlyRate:5699.8,currency:'INR'},
    availability:{blockedDates:['2026-11-18','2026-11-19','2026-11-20','2026-11-21','2026-11-22','2026-11-23','2026-11-24','2026-11-29','2026-11-30'],minNights:2},
    reviews,
    reviewTags:base.reviewTags.map((t,i)=>({...t,label:t.label==='Pool'?'Hot tub':t.label,emoji:['🛋️','✅','🛁','🪣','🎁','🧴','🎂','🖼️'][i]})),
    ratingBreakdown:{...base.ratingBreakdown,distribution:{5:18,4:1,3:0,2:0,1:0}},
    neighbourhood:{heading:'Neighbourhood highlights',body:'Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.'},
  };
}
