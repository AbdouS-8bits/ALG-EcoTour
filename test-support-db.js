const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSupportTables() {
  console.log('🧪 Testing Support Chat Database Setup...\n');

  try {
    // Test 1: Check if tables exist
    console.log('📊 Test 1: Checking if tables exist...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('support_sessions', 'support_messages')
    `;
    console.log('✅ Found tables:', tables);
    console.log('');

    // Test 2: Create a test session
    console.log('📝 Test 2: Creating test support session...');
    const testSession = await prisma.supportSession.create({
      data: {
        id: `test-${Date.now()}`,
        userName: 'Test User',
        userEmail: 'test@example.com',
        status: 'waiting',
      }
    });
    console.log('✅ Test session created:', testSession.id);
    console.log('');

    // Test 3: Create a test message
    console.log('💬 Test 3: Creating test message...');
    const testMessage = await prisma.supportMessage.create({
      data: {
        sessionId: testSession.id,
        message: 'Test message',
        senderType: 'user',
        senderName: 'Test User',
      }
    });
    console.log('✅ Test message created:', testMessage.id);
    console.log('');

    // Test 4: Query the session with messages
    console.log('🔍 Test 4: Querying session with messages...');
    const sessionWithMessages = await prisma.supportSession.findUnique({
      where: { id: testSession.id },
      include: { messages: true }
    });
    console.log('✅ Session found with', sessionWithMessages.messages.length, 'message(s)');
    console.log('');

    // Test 5: Update session status
    console.log('🔄 Test 5: Updating session status...');
    const updatedSession = await prisma.supportSession.update({
      where: { id: testSession.id },
      data: { status: 'active', agentName: 'Test Agent' }
    });
    console.log('✅ Session updated to:', updatedSession.status);
    console.log('');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await prisma.supportMessage.deleteMany({
      where: { sessionId: testSession.id }
    });
    await prisma.supportSession.delete({
      where: { id: testSession.id }
    });
    console.log('✅ Test data cleaned up');
    console.log('');

    console.log('🎉 ALL TESTS PASSED! Database is working correctly!');
    console.log('');
    console.log('✅ Your support chat system is ready to use!');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSupportTables();
