import { query } from '../lib/db';

async function seedJijelTourData() {
  try {
    console.log('🌍 Seeding Jijel Ecotourism Tour Data...');

    // 1. Create or get the Jijel tour
    const tourResult = await query(
      `INSERT INTO eco_tours (
        title, description, location, latitude, longitude, 
        price, "maxParticipants", duration, difficulty, status, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT DO NOTHING
      RETURNING id`,
      [
        'Jijel Coastal & Forest Ecotour',
        'اكتشف الكورنيش الساحلي من جيجل إلى حظيرة تازة مع زيارة الكهوف العجيبة وحديقة كيسير',
        'Jijel - Taza National Park',
        36.8270,
        5.7648,
        8500,
        25,
        8,
        'moderate',
        'active'
      ]
    );

    let tourId;
    if (tourResult.rows.length > 0) {
      tourId = tourResult.rows[0].id;
      console.log('✅ Tour created with ID:', tourId);
    } else {
      const existing = await query(
        `SELECT id FROM eco_tours WHERE title = $1`,
        ['Jijel Coastal & Forest Ecotour']
      );
      tourId = existing.rows[0]?.id;
      console.log('✅ Using existing tour ID:', tourId);
    }

    // 2. Insert waypoints from your CSV data
    const waypoints = [
      { code: 'PT01', name: 'Gare routière de Jijel', type: 'start', lng: 5.76484532537585, lat: 36.8270975299374, commune: 'Jijel', desc: 'نقطة الانطلاق: محطة الحافلات بجيجل، تجمع المشاركين وتعريف بالبرنامج.', time: 20, order: 1 },
      { code: 'PT02', name: 'Centre-ville Jijel', type: 'info', lng: 5.76334820437299, lat: 36.8212204257945, commune: 'Jijel', desc: 'مرور عبر وسط المدينة لاقتناء ما يلزم من ماء وطعام وتجهيزات خفيفة.', time: 15, order: 2 },
      { code: 'PT03', name: 'Plage Ouled Bounar', type: 'rest', lng: 5.71310725676346, lat: 36.8194111086212, commune: 'Jijel', desc: 'توقف قصير على الشاطئ للتصوير والاستراحة مع توعية حول حماية الساحل.', time: 30, order: 3 },
      { code: 'PT04', name: 'Parc Kissir (El Aouana)', type: 'rest', lng: 5.66345349653845, lat: 36.7908895790268, commune: 'El Aouana', desc: 'زيارة حديقة كيسير (حيوانات/طبيعة)، نشاط توعوي حول التنوع البيولوجي.', time: 60, order: 4 },
      { code: 'PT05', name: 'Vue corniche RN43', type: 'belvedere', lng: 5.40205172144044, lat: 36.6590965063213, commune: 'El Aouana', desc: 'نقطة إطلالة على الكورنيش والغابات، توقف قصير للصور وشرح المنظر.', time: 15, order: 5 },
      { code: 'PT06', name: 'Village El Aouana', type: 'service', lng: 5.61161490621063, lat: 36.7717658825582, commune: 'El Aouana', desc: 'توقف في القرية لوجبة خفيفة، دعم الاقتصاد المحلي (شراء منتجات محلية).', time: 30, order: 6 },
      { code: 'PT07', name: 'Plage Rocher Noir', type: 'rest', lng: 5.65208121373402, lat: 36.7894367829374, commune: 'Ziama Mansouria', desc: 'توقف على شاطئ صخري، نشاط توعوي حول النفايات البحرية.', time: 30, order: 7 },
      { code: 'PT08', name: 'Centre Ziama Mansouria', type: 'service', lng: 5.49641397972694, lat: 36.6841877798758, commune: 'Ziama Mansouria', desc: 'توقف قصير في وسط زيامة، آخر فرصة لاقتناء حاجيات قبل دخول الغابة.', time: 20, order: 8 },
      { code: 'PT09', name: 'Belvédère Forêt Taza', type: 'belvedere', lng: 5.49268734269796, lat: 36.6112327563701, commune: 'Ziama Mansouria', desc: 'إطلالة على الغابة والبحر، شرح عن النظم البيئية الغابية.', time: 20, order: 9 },
      { code: 'PT10', name: 'Grottes Merveilleuses', type: 'attraction', lng: 5.52088872947018, lat: 36.6831182303097, commune: 'Ziama Mansouria', desc: 'زيارة الكهوف العجيبة، شرح جيولوجي والجانب البيئي (حماية المواقع الحساسة).', time: 90, order: 10 },
      { code: 'PT11', name: 'Maison du Parc Taza', type: 'end', lng: 5.61362531502819, lat: 36.6893184581614, commune: 'Ziama Mansouria', desc: 'نقطة الوصول B: مركز الحظيرة، نشاطات توعوية وورشات بيئية.', time: 60, order: 11 },
      { code: 'PT12', name: 'Aire de repos forêt', type: 'rest', lng: 5.68272590637515, lat: 36.8058761681439, commune: 'Ziama Mansouria', desc: 'منطقة راحة داخل الغابة (غداء جماعي، مراقبة الطيور والنباتات).', time: 40, order: 12 },
    ];

    for (const wp of waypoints) {
      await query(
        `INSERT INTO tour_waypoints (
          waypoint_code, name, waypoint_type, latitude, longitude, commune, 
          description, visit_duration_minutes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (waypoint_code) DO UPDATE SET
          name = EXCLUDED.name,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          description = EXCLUDED.description`,
        [wp.code, wp.name, wp.type, wp.lat, wp.lng, wp.commune, wp.desc, wp.time]
      );
    }
    console.log('✅ Inserted', waypoints.length, 'waypoints');

    // 3. Insert road segments from your CSV
    const roads = [
      { code: 'R43_SEG1', name: 'RN43 Jijel - El Aouana', type: 'national', length: 15.0, status: 'good', importance: 'high', desc: 'مقطع من الطريق الوطني 43 يربط جيجل بالعوانة، طريق ساحلي مع مناظر بحرية.', time: 20, order: 1 },
      { code: 'R43_SEG2', name: 'RN43 El Aouana - Ziama', type: 'national', length: 20.5, status: 'good', importance: 'high', desc: 'مقطع من RN43 يربط العوانة بزيامة منصورية على الكورنيش.', time: 15, order: 2 },
      { code: 'R_KISSIR', name: 'Route vers Parc Kissir', type: 'local', length: 3.0, status: 'medium', importance: 'medium', desc: 'طريق محلي يربط RN43 بحديقة كيسير.', time: 30, order: 3 },
      { code: 'R_GROTTES', name: 'Accès Grottes Merveilleuses', type: 'local', length: 1.5, status: 'medium', importance: 'high', desc: 'طريق فرعي للوصول إلى الكهوف العجيبة.', time: 60, order: 4 },
      { code: 'R_FOREST', name: 'Chemin forestier Taza', type: 'trail', length: 2.5, status: 'natural', importance: 'medium', desc: 'مسار غابي داخل حظيرة تازة للوصول لنقاط المشاهدة وأماكن الراحة.', time: 15, order: 5 },
    ];

    for (const road of roads) {
      await query(
        `INSERT INTO road_segments (
          segment_code, name, road_type, length_km, road_status, importance, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (segment_code) DO UPDATE SET
          name = EXCLUDED.name,
          length_km = EXCLUDED.length_km`,
        [road.code, road.name, road.type, road.length, road.status, road.importance, road.desc]
      );
    }
    console.log('✅ Inserted', roads.length, 'road segments');

    // 4. Create route templates
    const routes = [
      {
        name: 'Complete Tour',
        type: 'complete',
        desc: 'الجولة الكاملة مع جميع المحطات - Complete coastal and forest experience',
        waypoints: ['PT01', 'PT02', 'PT03', 'PT04', 'PT05', 'PT06', 'PT07', 'PT08', 'PT09', 'PT10', 'PT11', 'PT12'],
        duration: 8,
        difficulty: 'moderate',
        recommended: 'nature lovers, photographers'
      },
      {
        name: 'Quick Coastal Route',
        type: 'quick',
        desc: 'مسار سريع على الساحل فقط - Fast coastal tour without forest',
        waypoints: ['PT01', 'PT02', 'PT03', 'PT07', 'PT11'],
        duration: 4,
        difficulty: 'easy',
        recommended: 'families, quick trips'
      },
      {
        name: 'Nature & Caves Focus',
        type: 'scenic',
        desc: 'التركيز على الطبيعة والكهوف - Nature parks and geological wonders',
        waypoints: ['PT01', 'PT04', 'PT09', 'PT10', 'PT11', 'PT12'],
        duration: 6,
        difficulty: 'moderate',
        recommended: 'nature enthusiasts, geology lovers'
      },
      {
        name: 'Foodie & Culture Route',
        type: 'cultural',
        desc: 'المسار الثقافي والطعام المحلي - Local cuisine and village culture',
        waypoints: ['PT01', 'PT02', 'PT06', 'PT08', 'PT11'],
        duration: 5,
        difficulty: 'easy',
        recommended: 'food lovers, cultural tourists'
      },
      {
        name: 'Direct Start to End',
        type: 'quick',
        desc: 'المسار المباشر - Fastest route from start to finish',
        waypoints: ['PT01', 'PT11'],
        duration: 2,
        difficulty: 'easy',
        recommended: 'time-limited visitors'
      }
    ];

    for (const route of routes) {
      await query(
        `INSERT INTO route_templates (
          tour_id, template_name, template_type, description, 
          waypoint_sequence, estimated_duration_hours, difficulty, recommended_for
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING`,
        [
          tourId,
          route.name,
          route.type,
          route.desc,
          JSON.stringify(route.waypoints),
          route.duration,
          route.difficulty,
          route.recommended
        ]
      );
    }
    console.log('✅ Created', routes.length, 'route templates');

    console.log('\n🎉 Jijel tour data seeded successfully!');
    console.log('📍 Total waypoints:', waypoints.length);
    console.log('🛣️  Total road segments:', roads.length);
    console.log('🗺️  Total route templates:', routes.length);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
  process.exit(0);
}

seedJijelTourData();
