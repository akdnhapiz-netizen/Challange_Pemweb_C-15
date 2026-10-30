import prisma from './prisma';

async function testCascade() {
  console.log('--- Testing Cascade Delete ---');
  try {
    // 1. Create a test user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Cascade Tester',
        password: 'password123',
      },
    });
    console.log('Created test user:', user.id);

    // 2. Create a test post
    const post = await prisma.post.create({
      data: {
        title: 'Post with comments',
        content: 'This post will be deleted to test cascade',
        authorId: user.id,
      },
    });
    console.log('Created test post:', post.id);

    // 3. Create comments for this post
    const comment1 = await prisma.comment.create({
      data: {
        content: 'First comment on post',
        postId: post.id,
        authorId: user.id,
      },
    });
    const comment2 = await prisma.comment.create({
      data: {
        content: 'Second comment on post',
        postId: post.id,
        authorId: user.id,
      },
    });
    console.log('Created comments:', comment1.id, comment2.id);

    // 4. Verify comments exist
    const countBefore = await prisma.comment.count({
      where: { postId: post.id },
    });
    console.log(`Comments before deleting post: ${countBefore} (expected: 2)`);

    // 5. Delete post
    console.log(`Deleting post ${post.id}...`);
    await prisma.post.delete({
      where: { id: post.id },
    });

    // 6. Check if comments were cascade-deleted
    const countAfter = await prisma.comment.count({
      where: { postId: post.id },
    });
    console.log(`Comments after deleting post: ${countAfter} (expected: 0)`);

    // Cleanup user
    await prisma.user.delete({ where: { id: user.id } });

    if (countAfter === 0) {
      console.log('✅ CASCADE DELETE TEST PASSED: Comments were automatically deleted when post was deleted!');
    } else {
      console.error('❌ CASCADE DELETE TEST FAILED: Comments still exist!');
    }
  } catch (error) {
    console.error('Error during cascade test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCascade();
