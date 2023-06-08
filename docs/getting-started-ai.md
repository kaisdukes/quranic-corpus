# Getting Started - AI 

**TL;DR**: This guide assists you in participating in the Quranic Arabic Corpus 2.0 project, specifically in getting the background knowledge required to work on Quranic AI.

The notes below are designed for volunteers who may not be experts in machine learning or NLP, but still want to learn and contribute. For this reason, we have tried to keep AI jargon and technical terms to a minimum.

### AI Background

The Linguistics Team for the corpus 2.0 project has made significant progress, completing around 50% of the Quran's grammar diagrams, also known as the treebank. This treebank follows the linguistic analysis found in *al-i’rāb al-mufassal*, maintaining a consistent reference throughout the project.

The process used to construct the existing treebank was as follows:

1. A statistical parser, trained by machine learning, generated draft grammar diagrams with an accuracy rate of around 89-90%.
2. Linguistic experts reviewed and corrected the AI’s output to ensure close to 100% gold-standard accuracy.

We want to repeat this process. However, we first need to update the parser’s code, written around 2011 before the advent of deep learning.

### Mentorship

We are offering free mentorship to individuals ready to explore AI and NLP. We'll aim to replicate the groundbreaking results of the 2011 study by [Dr. Kais Dukes](https://www.linkedin.com/in/kaisdukes) and [Nizar Habash](https://nyuad.nyu.edu/en/academics/divisions/science/faculty/nizar-habash.html), which used AI to parse the Quran. Our mission is to first match the success using the old model based on Support Vector Machines, then transition to a modern deep learning approach.

### Understanding the Goal

This isn't a general AI training program, as we have a specific goal. The mentorship has a specific goal: to gain enough NLP knowledge to replicate the 2011 Quran parsing paper: https://aclanthology.org/W11-2912.pdf

As this will require a lot of background knowledge, we would like those interested in the mentorship program to start by taking the Stanford NLP course:

Stanford CS224N: Natural Language Processing with Deep Learning

https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z

In order to "complete" the course, you would need to study the provided online videos. There are about 22 lectures, each an hour long.

We understand that this is a significant commitment, possibly requiring one or two weeks to complete. However, having this initial background is essential if we want to have success in our goal of completing the Quranic AI.

### Next Steps

Once you are feeling more comfortable with the NLP background to the project, we would love to invite you for a series of 1-1 sessions where we can make a plan for supporting you to gain the required expertise to start working on the Quranic AI.

For a deeper understanding of the existing 2011 parser, we recommend Chapters 9 and 10 of Dr. Dukes’ PhD thesis: *[Statistical Parsing by Machine Learning from a Classical Arabic Treebank](https://arxiv.org/pdf/1510.07193.pdf)*.