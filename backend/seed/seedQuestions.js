require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Question = require('../models/Question');

const sampleQuestions = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers, return indices of the two numbers that add up to a target.\n\nInput format:\nLine 1: n (size of array)\nLine 2: n space-separated integers\nLine 3: target\n\nOutput format:\nTwo indices (0-indexed), space-separated.',
    companies: ['Google', 'Amazon', 'Microsoft'],
    topics: ['Array', 'Hash Table'],
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/',
    frequency: 95,
    starterCode: {
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        // Write your solution here.
        // Print the two indices (0-indexed) separated by a space.

    }
}
`,
    },
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isSample: true },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', isSample: true },
      { input: '2\n3 3\n6', expectedOutput: '0 1', isSample: false },
    ],
  },
  { title: 'Reverse Linked List', description: 'Reverse a singly linked list.', companies: ['Microsoft', 'Amazon'], topics: ['Linked List'], difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/', frequency: 80 },
  { title: 'Longest Substring Without Repeating Characters', description: 'Find the length of the longest substring without repeating characters.', companies: ['Amazon', 'Bloomberg', 'Adobe'], topics: ['String', 'Sliding Window'], difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', frequency: 88 },
  { title: 'Merge Intervals', description: 'Merge all overlapping intervals.', companies: ['Google', 'Facebook'], topics: ['Array', 'Sorting'], difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/', frequency: 76 },
  { title: 'Trapping Rain Water', description: 'Compute how much water can be trapped after raining.', companies: ['Amazon', 'Google', 'Goldman Sachs'], topics: ['Array', 'Two Pointers', 'Stack'], difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/', frequency: 65 },
  { title: 'Binary Tree Level Order Traversal', description: 'Return the level order traversal of a binary tree.', companies: ['Microsoft', 'Amazon', 'Facebook'], topics: ['Tree', 'BFS'], difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', frequency: 70 },
  { title: 'Word Break', description: 'Determine if a string can be segmented into a space-separated sequence of dictionary words.', companies: ['Amazon', 'Google'], topics: ['DP', 'String'], difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/', frequency: 60 },
  { title: 'LRU Cache', description: 'Design and implement an LRU cache.', companies: ['Amazon', 'Microsoft', 'Bloomberg'], topics: ['Design', 'Hash Table', 'Linked List'], difficulty: 'Medium', link: 'https://leetcode.com/problems/lru-cache/', frequency: 82 },
  { title: 'Median of Two Sorted Arrays', description: 'Find the median of two sorted arrays.', companies: ['Google', 'Adobe'], topics: ['Array', 'Binary Search'], difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', frequency: 58 },
  { title: 'Number of Islands', description: 'Count the number of islands in a 2D grid.', companies: ['Amazon', 'Facebook', 'Microsoft'], topics: ['Graph', 'DFS', 'BFS'], difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/', frequency: 79 },
];

const seed = async () => {
  await connectDB();
  await Question.deleteMany({});
  await Question.insertMany(sampleQuestions);
  console.log('Seeded questions successfully');
  mongoose.connection.close();
};

seed();
