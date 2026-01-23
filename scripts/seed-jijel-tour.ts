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
        36.8160,
        5.7500,
        8500, // Price in DZD
        25,
        8, // 8 hours
        'moderate',
        'active'
      ]
    );

    let tourId;
    if (tourResult.rows.length > 0) {
      tourId = tourResult.rows[0].id;
      console.log('✅ Tour created with ID:', tourId);
    } else {
      // Get existing tour
      const existing = await query(
        `SELECT id FROM eco_tours WHERE title = $1`,
        ['Jijel Coastal & Forest Ecotour']
      );
      tourId = existing.rows[0]?.id;
      console.log('✅ Using existing tour ID:', tourId);
    }

    // 2. Insert waypoints
    const waypoints = [
      { code: 'PT01', name: 'Gare routière de Jijel', type: 'start', lng: 5.7500, lat: 36.8160, commune: 'Jijel', desc: 'نقطة الانطلاق: محطة الحافلات بجيجل، تجمع المشاركين وتعريف بالبرنامج.', time: 20, order: 1 },
      { code: 'PT02', name: 'Centre-ville Jijel', type: 'info', lng: 5.7545, lat: 36.8200, commune: 'Jijel', desc: 'مرور عبر وسط المدينة لاقتناء ما يلزم من ماء وطعام وتجهيزات خفيفة.', time: 15, order: 2 },
      { code: 'PT03', name: 'Plage Ouled Bounar', type: 'rest', lng: 5.6900, lat: 36.8280, commune: 'Jijel', desc: 'توقف قصير على الشاطئ للتصوير والاستراحة مع توعية حول حماية الساحل.', time: 30, order: 3 },
      { code: 'PT04', name: 'Parc Kissir (El Aouana)', type: 'attraction', lng: 5.6720, lat: 36.7978, commune: 'El Aouana', desc: 'زيارة حديقة كيسير (حيوانات/طبيعة)، نشاط توعوي حول التنوع البيولوجي.', time: 60, order: 4 },
      { code: 'PT05', name: 'Vue corniche RN43', type: 'belvedere', lng: 5.6500, lat: 36.8300, commune: 'El Aouana', desc: 'نقطة إطلالة على الكورنيش والغابات، توقف قصير للصور وشرح المنظر.', time: 15, order: 5 },
      { code: 'PT06', name: 'Village El Aouana', type: 'service', lng: 5.6100, lat: 36.8350, commune: 'El Aouana', desc: 'توقف في القرية لوجبة خفيفة، دعم الاقتصاد المحلي (شراء منتجات محلية).', time: 30, order: 6 },
      { code: 'PT07', name: 'Plage Rocher Noir', type: 'rest', lng: 5.5700, lat: 36.8450, commune: 'Ziama Mansouria', desc: 'توقف على شاطئ صخري، نشاط توعوي حول النفايات البحرية.', time: 30, order: 7 },
      { code: 'PT08', name: 'Centre Ziama Mansouria', type: 'service', lng: 5.5100, lat: 36.8550, commune: 'Ziama Mansouria', desc: 'توقف قصير في وسط زيامة، آخر فرصة لاقتناء حاجيات قبل دخول الغابة.', time: 20, order: 8 },
      { code: 'PT09', name: 'Belvédère Forêt Taza', type: 'belvedere', lng: 5.4800, lat: 36.8600, commune: 'Ziama Mansouria', desc: 'إطلالة على الغابة والبحر، شرح عن النظم البيئية الغابية.', time: 20, order: 9 },
      { code: 'PT10', name: 'Grottes Merveilleuses', type: 'attraction', lng: 5.5183, lat: 36.6828, commune: 'Ziama Mansouria', desc: 'زيارة الكهوف العجيبة، شرح جيولوجي والجانب البيئي (حماية المواقع الحساسة).', time: 90, order: 10 },
      { code: 'PT11', name: 'Maison du Parc Taza', type: 'end', lng: 5.4600, lat: 36.8650, commune: 'Ziama Mansouria', desc: 'نقطة الوصول: مركز الحظيرة، نشاطات توعوية وورشات بيئية.', time: 60, order: 11 },
      { code: 'PT12', name: 'Aire de repos forêt', type: 'rest', lng: 5.4700, lat: 36.8620, commune: 'Ziama Mansouria', desc: 'منطقة راحة داخل الغابة (غداء جماعي، مراقبة الطيور والنباتات).', time: 40, order: 12 },
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
          longitude = EXCLUDED.longitude`,
        [wp.code, wp.name, wp.type, wp.lat, wp.lng, wp.commune, wp.desc, wp.time]
      );
    }
    console.log('✅ Inserted', waypoints.length, 'waypoints');

    // 3. Create route templates
    const routes = [
      {
        name: 'Complete Tour',
        type: 'complete',
        desc: 'الجولة الكاملة مع جميع المحطات',
        waypoints: ['PT01', 'PT02', 'PT03', 'PT04', 'PT05', 'PT06', 'PT07', 'PT08', 'PT09', 'PT10', 'PT11', 'PT12'],
        duration: 8,
        difficulty: 'moderate'
      },
      {
        name: 'Quick Coastal Route',
        type: 'quick',
        desc: 'مسار سريع على الساحل فقط',
        waypoints: ['PT01', 'PT02', 'PT03', 'PT07', 'PT11'],
        duration: 4,
        difficulty: 'easy'
      },
      {
        name: 'Nature & Caves Focus',
        type: 'scenic',
        desc: 'التركيز على الطبيعة والكهوف',
        waypoints: ['PT01', 'PT04', 'PT09', 'PT10', 'PT11', 'PT12'],
        duration: 6,
        difficulty: 'moderate'
      },
      {
        name: 'Foodie & Culture Route',
        type: 'cultural',
        desc: 'المسار الثقافي والطعام المحلي',
        waypoints: ['PT01', 'PT02', 'PT06', 'PT08', 'PT11'],
        duration: 5,
        difficulty: 'easy'
      }
    ];

    for (const route of routes) {
      const routeResult = await query(
        `INSERT INTO route_templates (
          tour_id, template_name, template_type, description, 
          waypoint_sequence, estimated_duration_hours, difficulty
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
        [
          tourId,
          route.name,
          route.type,
          route.desc,
          JSON.stringify(route.waypoints),
          route.duration,
          route.difficulty
        ]
      );
      console.log(`✅ Created route: ${route.name}`);
    }

    // 4. Insert road segments
    const roads = [
      { code: 'R43_SEG1', name: 'RN43 Jijel - El Aouana', type: 'national', length: 15.0, status: 'good', importance: 'high', desc: 'مقطع من الطريق الوطني 43 يربط جيجل بالعوانة، طريق ساحلي مع مناظر بحرية.' },
      { code: 'R43_SEG2', name: 'RN43 El Aouana - Ziama', type: 'national', length: 20.5, status: 'good', importance: 'high', desc: 'مقطع من RN43 يربط العوانة بزيامة منصورية على الكورنيش.' },
      { code: 'R_KISSIR', name: 'Route vers Parc Kissir', type: 'local', length: 3.0, status: 'medium', importance: 'medium', desc: 'طريق محلي يربط RN43 بحديقة كيسير.' },
      { code: 'R_GROTTES', name: 'Accès Grottes Merveilleuses', type: 'local', length: 1.5, status: 'medium', importance: 'high', desc: 'طريق فرعي للوصول إلى الكهوف العجيبة.' },
      { code: 'R_FOREST', name: 'Chemin forestier Taza', type: 'trail', length: 2.5, status: 'natural', importance: 'medium', desc: 'مسار غابي داخل حظيرة تازة للوصول لنقاط المشاهدة وأماكن الراحة.' },
    ];

    for (const road of roads) {
      await query(
        `INSERT INTO road_segments (
          segment_code, name, road_type, length_km, road_status, importance, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (segment_code) DO NOTHING`,
        [road.code, road.name, road.type, road.length, road.status, road.importance, road.desc]
      );
    }
    console.log('✅ Inserted road segments');

    console.log('🎉 Jijel tour data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedJijelTourData();
