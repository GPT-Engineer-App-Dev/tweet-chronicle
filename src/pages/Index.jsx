// Complete the Index page component here
// Use chakra-ui
import { Box, VStack, Input, Button, Text, useToast } from '@chakra-ui/react';
import { getClient } from '../../lib/crud';
import { useState, useEffect } from 'react';


const Index = () => {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const toast = useToast();
  const client = getClient('twitter-clone');

  useEffect(() => {
    const fetchTweets = async () => {
      const fetchedTweets = await client.getWithPrefix('tweet:');
      if (fetchedTweets) {
        setTweets(fetchedTweets.sort((a, b) => new Date(b.value.created_at) - new Date(a.value.created_at)));
      }
    };
    fetchTweets();
  }, []);

  const postTweet = async () => {
    if (!username || !content) {
      toast({
        title: 'Error',
        description: 'Username and tweet content are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const tweet = { username, content, created_at: new Date().toISOString() };
    await client.set(`tweet:${Date.now()}`, tweet);
    setTweets([tweet, ...tweets]);
    setContent('');
  };

  return (
    <VStack spacing={4} p={5}>
      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input placeholder="What's happening?" value={content} onChange={(e) => setContent(e.target.value)} />
      <Button onClick={postTweet}>Tweet</Button>
      {tweets.map((tweet, index) => (
        <Box key={index} p={4} shadow='md' borderWidth='1px'>
          <Text fontWeight='bold'>{tweet.username}</Text>
          <Text>{tweet.content}</Text>
          <Text fontSize='xs'>{new Date(tweet.created_at).toLocaleString()}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default Index;