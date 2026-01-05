import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecotour.com" },
    update: {},
    create: {
      email: "admin@ecotour.com",
      name: "Admin User",
      password: "Admin@123", // Change this to a hashed password in production
      role: "admin",
    },
  });

  console.log("✅ Admin user created/updated:", admin);

  // Clear existing tours
  await prisma.booking.deleteMany();
  await prisma.ecoTour.deleteMany();

  // Add sample eco tours
  const tours = [
    {
      title: 'رحلة إلى الصحراء الكبرى',
      description: 'استكشف جمال الصحراء الجزائرية مع رحلة لا تنسى إلى عين صالح وتمنراست. تشمل الرحلة الإقامة في مخيمات صحراوية تقليدية وتجربة ركوب الجمال.',
      location: 'عين صالح، تمنراست',
      latitude: 28.9470,
      longitude: 2.9340,
      price: 15000.00,
      maxParticipants: 20,
      photoURL: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
    },
    {
      title: 'تسلق جبال الأطلس',
      description: 'رحلة مغامرة في جبال الأطلس الصحراوية مع مرشدين محترفين. استمتع بالمناظر الطبيعية الخلابة والقرى الجبلية التقليدية.',
      location: 'تيزي وزو، باتنة',
      latitude: 35.4820,
      longitude: 5.7340,
      price: 8500.00,
      maxParticipants: 15,
      photoURL: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=800&h=600&fit=crop'
    },
    {
      title: 'استكشاف واحات غرداية',
      description: 'جولة في واحات غرداية الخضراء مع زيارة للمواقع الأثرية والتعرف على الزراعة التقليدية والثقافة المحلية.',
      location: 'غرداية',
      latitude: 32.4800,
      longitude: 3.6700,
      price: 12000.00,
      maxParticipants: 25,
      photoURL: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    },
    {
      title: 'رحلة بحرية إلى عنابة',
      description: 'استمتع بالسواحل المتوسطية الجزائرية مع رحلة بحرية تشمل الغوص والسباحة واستكشاف الشعاب المرجانية.',
      location: 'عنابة',
      latitude: 36.9000,
      longitude: 7.7700,
      price: 9500.00,
      maxParticipants: 18,
      photoURL: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
    },
    {
      title: 'زيارة لمواقع الطاسيلي',
      description: 'اكتشف رسوم الكهوف القديمة في الطاسيلي ناجر، أحد مواقع التراث العالمي لليونسكو.',
      location: 'دران، الطاسيلي',
      latitude: 24.5500,
      longitude: 9.4500,
      price: 18000.00,
      maxParticipants: 12,
      photoURL: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop'
    },
    {
      title: 'رحلة إلى قصور تيميمون',
      description: 'استكشاف قصور تيميمون الأثرية والتعرف على العمارة الصحراوية التقليدية والحياة في واحات الصحراء.',
      location: 'تيميمون',
      latitude: 33.1100,
      longitude: 0.2400,
      price: 13500.00,
      maxParticipants: 20,
      photoURL: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop'
    }
  ];

  console.log('🌱 Starting to seed tours...');
  
  for (const tour of tours) {
    await prisma.ecoTour.create({
      data: tour,
    });
    console.log(`✅ Created tour: ${tour.title}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
