# Getting Started - AI 

**TL;DR**: This guide assists you in participating in the Quranic Arabic Corpus 2.0 project, specifically in getting the background knowledge required to work on the Quranic AI.

The notes below are designed for volunteers who may not be experts in machine learning or NLP, but still want to learn and contribute. For this reason, we have tried to keep AI jargon and technical terms to a minimum.

### AI Background

The Linguistics Team for the corpus 2.0 project has made significant progress, completing around 50% of the Quran's grammar diagrams, also known as the treebank. The Quranic Treebank follows the linguistic analysis found in *al-i’rāb al-mufassal*, maintaining a consistent reference throughout the project.

The process used to construct the existing treebank was as follows:

1. A statistical parser, trained by machine learning, generated draft grammar diagrams with an accuracy rate of around 89-90%.
2. Linguistic experts reviewed and corrected the AI’s output to ensure close to 100% gold-standard accuracy.

We want to repeat this process. However, we first need to update the parser’s code, written around 2011 before the advent of deep learning.

### Mentorship

We are offering free mentorship to individuals ready to explore AI and NLP. We'll aim to replicate the groundbreaking results of the 2011 study by [Dr. Kais Dukes](https://www.linkedin.com/in/kaisdukes) and [Nizar Habash](https://nyuad.nyu.edu/en/academics/divisions/science/faculty/nizar-habash.html), which used AI to parse the Quran.

Our mission is to first match the success using the old model based on Support Vector Machines (SVMs), then transition to a modern deep learning approach using the latest advances in AI and NLP. The plan is to evaluate different machine learning models to find the best approach given the unique nature of the Quranic text. Models could include (but are not limited to) sequence to sequence models and transformers.

You can find the original 2011 SVM paper here: https://aclanthology.org/W11-2912.pdf

### Understanding the Goal

As this goal requires a lot of background knowledge, we would like those interested in the mentorship program to start by taking the Stanford NLP course:

*Stanford CS224N: Natural Language Processing with Deep Learning*

https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z

In order to "complete" the course, you would need to study the provided online videos. There are about 22 lectures, each an hour long.

We understand that this is a significant commitment, possibly requiring one or two weeks to complete. However, having this initial background is essential if we want to have success in our goal of completing the Quranic AI.

### Next Steps

Once you are feeling more comfortable with the NLP background to the project, we would love to invite you for a series of 1-1 sessions where we can make a plan for supporting you to gain the required expertise to start working on the parser.

For a deeper understanding of the existing 2011 SVM paper, we recommend Chapters 9 and 10 of Dr. Dukes’ PhD thesis: *[Statistical Parsing by Machine Learning from a Classical Arabic Treebank](https://arxiv.org/pdf/1510.07193.pdf)*.

### Verse Segmentation

Another area of interest to AI is verse segmentation: dividing larger verses into multiple dependency graphs, and merging smaller verses into one graph, where this makes sense semantically and simplifies the diagrams.

Large portions of the Quran contain lengthy verses. The Quranic Treebank is designed primarily as an educational resource, allowing users of the corpus to gain deeper linguistic understanding of the Classical Arabic language of the Quran through side-by-side comparison with *i’rāb* (إعراب), traditional linguistic analysis.

For this reason, dependency graphs are kept intentionally short, for easier display on mobile devices. Larger syntactic structures that cross graphs are linked together through reference nodes.

To complete the treebank, we will need to perform verse segmentation. There are multiple ways this could be done, but one possibility would be to train a machine learning model using four sources of data:

**Existing segmentation:** The existing segmentation implied by the existing dependency graphs covering 50% of the Quran.

**Reference grammar alignment:** The breakdown of verses into word groups in the reference grammar used to construct the treebank, Salih’s al-I’rāb al-Mufassal. In principle, this could be a strong choice for training the model as the treebank was initially segmented to support easier alignment and cross-referencing with al-I’rāb al-Mufassal.

**Pause marks:** Although the Classical Arabic Uthmani script of the Quran doesn’t contain modern punctuation like full stops or commas, it does contain [pause marks](https://corpus.quran.com/documentation/pausemarks.jsp) (to support waqf and tajweed), which may aid in segmentation.

**Punctuation from translations:** The Quran now has word-aligned translations in multiple languages, which often include punctuation. Using this data may also help boost the accuracy of the verse segmenter.

For any model, it would be essential to perform evaluation to test the accuracy of the segmenter. Because evaluation would need to test against the existing segmentation, it would make sense to start with that as the first dataset, and then try the other sources to see how that might boost accuracy. Choosing just one signal, like waqf marks, might not lead to optimal accuracy.


