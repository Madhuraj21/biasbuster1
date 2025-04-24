const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_MODEL, GEMINI_TIMEOUT } = require('../config/constants');
const { validationResult } = require('express-validator');

// Load Gemini API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

/**
 * Analyze a news article for bias, rewrite it, and find related articles.
 * Handles both pasted text and URLs.
 */
exports.analyzeArticle = async (req, res) => {
  console.log('analyzeArticle called');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  let { content, isUrl } = req.body;
  console.log(`Content received: ${content}`);
  console.log(`isUrl: ${isUrl}`);

  try {
    if (isUrl) {
      console.log(`Fetching content from URL: ${content}`);
      // Fetch content from URL
      try {
        const response = await axios.get(content);
        const $ = cheerio.load(response.data);
        // Attempt to extract main article text using common selectors
        const articleSelectors = [
          'article',
          'div[itemprop="articleBody"]',
          'div.article-body',
          'div.entry-content',
          'div.post-content',
          'div.story-content',
          'div#body-text',
          'p' // Fallback to paragraphs
        ];

        let extractedText = '';
        for (const selector of articleSelectors) {
          extractedText = $(selector).text().trim();
          if (extractedText) {
            console.log(`Content extracted successfully using selector: ${selector}`);
            break; // Stop if content is found
          }
        }

        if (!extractedText) {
           extractedText = $('body').text().trim(); // Fallback to body text
           console.log('No specific article content found, falling back to body text.');
        }

        content = extractedText;
        console.log('Content fetched and extracted successfully.');

        // Use Gemini to clean up the extracted text
        console.log('Sending extracted content to Gemini for cleaning.');
        const cleanPrompt = `Clean up the following raw text extracted from a news article. Remove any irrelevant content such as headers, footers, navigation links, advertisements, social media prompts, or other boilerplate text. Return ONLY the core article content.

        Raw Text:
        """
        ${content}
        """
        `;

        const cleanResult = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: cleanPrompt }] }],
          generationConfig: {
            candidateCount: 1,
            timeout: GEMINI_TIMEOUT,
          },
        });
        const cleanedText = cleanResult.response.text().trim();
        console.log('Content cleaned successfully by Gemini.');
        content = cleanedText; // Use the cleaned text for analysis and display

      } catch (error) {
        console.error('Error fetching, extracting, or cleaning content from URL:', error);
        // Return an error response to the frontend immediately
        return res.status(500).json({ message: `Error fetching, extracting, or cleaning article from URL: ${content}. Please check the URL and try again.` });
      }
    }

    if (!content || content.trim() === '') {
      console.log('No content provided for analysis.');
      return res.status(400).json({ message: 'No content provided for analysis.' });
    }

    console.log('Sending cleaned content to Gemini model for analysis.');
    // Use Generative AI to analyze bias
    const prompt = `Analyze the following **cleaned news article content** for bias. 
    
    **Instructions for Analysis:**
    1. Identify the core topic and key entities discussed in the article.
    2. Determine the publication date or timeframe of the article if possible from the content.
    3. Analyze the language, tone, and framing to identify any potential biases (e.g., emotional language, political slant, sensationalism, bias by omission).
    4. Provide a single overall bias score out of 100 (0 being completely neutral, 100 being extremely biased).
    5. Assign a brief bias label (e.g., "Low Bias", "Moderate Bias", "High Bias").
    6. Break down the bias by type (e.g., Emotional, Political, Sensationalism, Bias by Omission) and provide a score out of 100 for each. Suggest a color hex code for visualizing each bias type.
    7. Determine the overall sentiment (e.g., positive, negative, neutral).
    8. Provide a concise summary of the article.
    9. Suggest how to rewrite the article to be more neutral.
    10. Provide a rewritten version of the article that summarizes the original content neutrally.

    **Instructions for Finding Related Articles:**
    1. Search broadly and deeply across reputable news sources and publications on the internet to find the *most relevant* articles related to the original article's topic and key entities.
    2. **Crucially, prioritize finding articles published around the same timeframe as the original article.** Avoid suggesting articles that are significantly older or cover the topic from a completely different time period.
    3. For each relevant related article found, provide its title, the source name, a bias score (analyzed by you), and the **complete and valid URL**. Double-check that the URL is correct and directly links to the article.
    4. Include as many relevant related articles as you can find, up to a reasonable number (e.g., 5-10), prioritizing quality and relevance over quantity.
    5. If no relevant related articles can be found after a thorough search, return an empty array for the relatedArticles field.

    Format the output as a JSON object with the following structure:
    {
      "originalArticle": string, // This should be the cleaned article content
      "publicationDate": string, 
      "biasScore": number,
      "biasLabel": string,
      "biasBreakdown": [
        { "label": string, "score": number, "color": string },
        ...
      ],
      "sentiment": string, 
      "summary": string, 
      "suggestion": string,
      "rewrittenArticle": string, 
      "relatedArticles": [
        { "title": string, "source": string, "biasScore": number, "url": string }, 
        ...
      ]
    }

    Cleaned Article Content:
    """
    ${content}
    """
    `;
    console.log(`Prompt being sent to Gemini for analysis: ${prompt}`);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // Only generate one candidate
        candidateCount: 1,
        timeout: GEMINI_TIMEOUT, // timeout in milliseconds
      },
    });
    const response = result.response;
    const text = response.text();

    console.log('Received response from Gemini model.');
    console.log('Attempting to parse AI response as JSON:', text);

    // Attempt to parse the JSON response from the model
    let analysisResults;
    try {
      // Attempt to parse the JSON response from the model
      const cleanedText = text.trim().replace(/^```json\s*|```$/g, '').replace(/^json\s*/, '');
      console.log('Cleaned AI response:', cleanedText);
      try {
        analysisResults = JSON.parse(cleanedText);
        console.log('Successfully parsed AI response as JSON.');
      } catch (nestedParseError) {
        console.error('Failed to parse AI response as JSON, attempting to fix:', cleanedText, nestedParseError);
        // Attempt to fix the JSON by adding quotes to keys and values
        const fixedText = cleanedText.replace(/([a-zA-Z0-9_]+):/g, '"$1":').replace(/:(?!\s*(\{|\[|"))\s*([a-zA-Z0-9_\-]+)/g, ':"$2"');
        console.log('Attempting to parse fixed AI response as JSON:', fixedText);
        analysisResults = JSON.parse(fixedText);
        console.log('Successfully parsed fixed AI response as JSON.');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text, parseError);
      // Fallback or error handling if AI doesn't return perfect JSON
      return res.status(500).json({ message: 'Failed to parse analysis results from AI.' });
    }

    console.log('Sending analysis results to frontend:', analysisResults);
    res.json(analysisResults);

  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ message: 'Error analyzing article', error: error.message });
  }
};
