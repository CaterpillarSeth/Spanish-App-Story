import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

const lessonTopics = [
  { number: 1, topic: "Spanish Alphabet and Pronunciation", description: "Learn the Spanish alphabet and how to pronounce each letter correctly." },
  { number: 2, topic: "Basic Greetings and Introductions", description: "Master common greetings and how to introduce yourself in Spanish." },
  { number: 3, topic: "Definite and Indefinite Articles", description: "Understand when to use el, la, los, las, un, una, unos, unas." },
  { number: 4, topic: "Noun Gender and Number", description: "Learn how Spanish nouns have gender and how to make them plural." },
  { number: 5, topic: "Subject Pronouns", description: "Master yo, tú, él, ella, nosotros, vosotros, ellos, ellas, usted, ustedes." },
  { number: 6, topic: "Present Tense Regular Verbs (-ar)", description: "Learn to conjugate regular -ar verbs in the present tense." },
  { number: 7, topic: "Present Tense Regular Verbs (-er, -ir)", description: "Learn to conjugate regular -er and -ir verbs in the present tense." },
  { number: 8, topic: "Ser vs Estar", description: "Understand the difference between the two verbs 'to be' in Spanish." },
  { number: 9, topic: "Adjective Agreement", description: "Learn how adjectives must agree with nouns in gender and number." },
  { number: 10, topic: "Numbers 1-100", description: "Master counting and using numbers in Spanish." },
  { number: 11, topic: "Question Words", description: "Learn qué, quién, dónde, cuándo, por qué, cómo, cuánto." },
  { number: 12, topic: "Possessive Adjectives", description: "Master mi, tu, su, nuestro, vuestro and their uses." },
  { number: 13, topic: "Demonstrative Adjectives", description: "Learn este, ese, aquel and their variations." },
  { number: 14, topic: "Common Irregular Verbs", description: "Master irregular verbs like ir, tener, hacer, decir." },
  { number: 15, topic: "Stem-Changing Verbs", description: "Learn about e→ie, o→ue, and e→i verb changes." },
  { number: 16, topic: "Reflexive Verbs", description: "Understand reflexive pronouns and reflexive verb conjugations." },
  { number: 17, topic: "Prepositions of Place", description: "Learn en, sobre, bajo, delante de, detrás de, etc." },
  { number: 18, topic: "Time Expressions", description: "Master telling time and using time-related expressions." },
  { number: 19, topic: "Direct Object Pronouns", description: "Learn me, te, lo, la, nos, os, los, las." },
  { number: 20, topic: "Indirect Object Pronouns", description: "Master me, te, le, nos, os, les and their uses." }
];

export async function generateLesson(lessonNumber: number) {
  const lessonInfo = lessonTopics[lessonNumber - 1] || {
    number: lessonNumber,
    topic: "Advanced Spanish Concepts",
    description: "Continue your Spanish learning journey with advanced topics."
  };
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Spanish teacher creating comprehensive lessons for beginners. Provide clear explanations with examples."
        },
        {
          role: "user",
          content: `Create a detailed Spanish lesson about "${lessonInfo.topic}". 
          
Include:
1. Clear explanation of the concept
2. 5-7 practical examples with English translations
3. Common mistakes to avoid
4. Practice tips

Keep the lesson engaging and easy to understand for beginners. Use markdown formatting.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return {
      title: lessonInfo.topic,
      content: completion.choices[0].message.content || 'Lesson content unavailable'
    };
  } catch (error) {
    console.error('Error generating lesson:', error);
    return {
      title: lessonInfo.topic,
      content: `# ${lessonInfo.topic}\n\n${lessonInfo.description}\n\nThis lesson is being prepared. Please check back later or contact support if this persists.`
    };
  }
}

export async function generateRecapQuestions(lessonTitle: string, lessonContent: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are creating a short quiz to test understanding of a Spanish lesson. Return ONLY a valid JSON array."
        },
        {
          role: "user",
          content: `Based on this lesson about "${lessonTitle}", create 5 multiple-choice questions to test understanding.

Lesson content:
${lessonContent.substring(0, 1000)}

Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const content = completion.choices[0].message.content || '[]';
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error generating recap questions:', error);
    return [
      {
        question: `What was the main topic of the lesson on ${lessonTitle}?`,
        options: [lessonTitle, "Something else", "Not covered", "Unknown"],
        correctAnswer: lessonTitle
      }
    ];
  }
}

export async function generateStory(topic: string, vocabulary: string[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative Spanish teacher writing engaging stories for language learners. Use ONLY the vocabulary words provided."
        },
        {
          role: "user",
          content: `Write a short, engaging story in Spanish about "${topic}".

IMPORTANT RULES:
1. Use ONLY these vocabulary words: ${vocabulary.join(', ')}
2. Keep sentences simple and clear
3. The story should be 10-15 sentences long
4. Make it interesting and relevant to the topic
5. After the Spanish story, provide an English translation

Format:
**Historia en Español:**
[Spanish story here]

**English Translation:**
[English translation here]`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });
    
    return completion.choices[0].message.content || 'Story generation unavailable';
  } catch (error) {
    console.error('Error generating story:', error);
    return `**Historia en Español:**\nLo siento, no puedo generar una historia en este momento.\n\n**English Translation:**\nSorry, I cannot generate a story at this time. Please try again later.`;
  }
}
