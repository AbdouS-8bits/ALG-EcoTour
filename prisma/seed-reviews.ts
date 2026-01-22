import { prisma } from '../lib/prisma';

async function seedReviews() {
  console.log('🌱 Seeding review test data...');

  try {
    // Get existing users and tours
    const users = await prisma.user.findMany({ take: 5 });
    const tours = await prisma.ecoTour.findMany({ take: 3 });

    if (users.length === 0) {
      console.log('❌ No users found. Please create users first.');
      return;
    }

    if (tours.length === 0) {
      console.log('❌ No tours found. Please create tours first.');
      return;
    }

    console.log(`Found ${users.length} users and ${tours.length} tours`);

    const reviewTexts = [
      {
        rating: 5,
        comment: 'Amazing experience! The tour guide was knowledgeable and friendly. The landscapes were breathtaking and I learned so much about the local ecosystem. Highly recommended for anyone interested in ecotourism!'
      },
      {
        rating: 4,
        comment: 'Great tour overall. The scenery was beautiful and the activities were well-organized. Only minor complaint is that it could have been a bit longer. Would definitely do it again!'
      },
      {
        rating: 5,
        comment: 'Absolutely incredible! This was the highlight of our trip. The guides were professional, the locations were pristine, and we saw wildlife we never expected to see. Worth every penny!'
      },
      {
        rating: 3,
        comment: 'Good tour but had some issues. The meeting point was confusing and we started late. The actual tour was nice once we got going. The guide was friendly but could have provided more information.'
      },
      {
        rating: 4,
        comment: 'Very enjoyable experience. The natural beauty was stunning and the tour was well-paced. Great value for money. Only wish there were more photo opportunities!'
      },
      {
        rating: 5,
        comment: 'Perfect day out! Everything was well-organized from start to finish. The guide was excellent and really passionate about conservation. Learned a lot and had fun too!'
      },
      {
        rating: 4,
        comment: 'Solid tour with beautiful views. The group size was perfect - not too crowded. Would recommend bringing good walking shoes and plenty of water!'
      },
      {
        rating: 5,
        comment: 'One of the best tours I have ever been on! The attention to detail was impressive and the commitment to sustainability was evident throughout. Cannot recommend enough!'
      },
    ];

    let reviewCount = 0;
    let messageCount = 0;

    // Create reviews for each tour
    for (const tour of tours) {
      console.log(`Creating reviews for tour: ${tour.title}`);
      
      // Create 3-5 reviews per tour
      const numReviews = Math.floor(Math.random() * 3) + 3;
      const usedUsers = new Set();

      for (let i = 0; i < numReviews && users.length > usedUsers.size; i++) {
        // Get a random user that hasn't reviewed this tour yet
        let user;
        do {
          user = users[Math.floor(Math.random() * users.length)];
        } while (usedUsers.has(user.id));
        
        usedUsers.add(user.id);

        // Get a random review text
        const reviewData = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];

        // Create the review
        const review = await prisma.review.create({
          data: {
            tourId: tour.id,
            userId: user.id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            likes: Math.floor(Math.random() * 20),
            helpful: Math.floor(Math.random() * 15),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          },
        });

        reviewCount++;
        console.log(`  ✓ Created review by ${user.email} (${review.rating} stars)`);

        // Create 0-3 messages for this review
        const numMessages = Math.floor(Math.random() * 4);
        for (let j = 0; j < numMessages; j++) {
          const messageUser = users[Math.floor(Math.random() * users.length)];
          const messageTexts = [
            'Thanks for sharing your experience!',
            'I completely agree with you!',
            'This is very helpful, thank you!',
            'Great review, very detailed!',
            'I had a similar experience!',
            'Thanks for the tips!',
            'Sounds amazing, I want to go too!',
            'Very informative review!',
          ];

          await prisma.reviewMessage.create({
            data: {
              reviewId: review.id,
              userId: messageUser.id,
              message: messageTexts[Math.floor(Math.random() * messageTexts.length)],
              createdAt: new Date(review.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date after review
            },
          });

          messageCount++;
        }
      }
    }

    console.log('');
    console.log('✅ Seed completed successfully!');
    console.log(`📊 Created ${reviewCount} reviews and ${messageCount} messages`);
    console.log('');
    console.log('🎉 You can now test the review system with realistic data!');

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
