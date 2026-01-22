const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSessions() {
  console.log('\n🔍 Checking Support Sessions...\n');

  try {
    // Check all sessions
    const allSessions = await prisma.supportSession.findMany({
      include: {
        messages: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total sessions in database: ${allSessions.length}\n`);

    if (allSessions.length > 0) {
      allSessions.forEach((session, index) => {
        console.log(`Session ${index + 1}:`);
        console.log(`  ID: ${session.id}`);
        console.log(`  User: ${session.userName} (${session.userEmail})`);
        console.log(`  Status: ${session.status}`);
        console.log(`  Agent: ${session.agentName || 'None'}`);
        console.log(`  Messages: ${session.messages.length}`);
        console.log(`  Created: ${session.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No sessions found in database');
      console.log('This means sessions are NOT being created\n');
    }

    // Check waiting sessions specifically
    const waiting = await prisma.supportSession.findMany({
      where: { status: 'waiting' }
    });

    console.log(`⏳ Waiting sessions: ${waiting.length}`);

    // Check active sessions
    const active = await prisma.supportSession.findMany({
      where: { status: 'active' }
    });

    console.log(`✅ Active sessions: ${active.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSessions();
