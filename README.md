# [Speedreading](https://jonathan357611.github.io/Speedreading/) 📚

![Screenshot of the website](https://github.com/Jonathan357611/Speedreading/assets/63909127/4daf3658-c719-43ff-9895-a4d492b66049)

This is a cool test to see how fast you could theoretically read.
[You can try it out here](https://jonathan357611.github.io/Speedreading/)

## What is it? 👁️

I've once seen a demonstration where you can apparently read a lot faster if you have every individual word flashing before your eyes.
Our brain and eyes are supposedly very capable to recognize words at extreme speeds - even unconsciously.

This project aims to demonstrate exactly this. Out of a few books in a few selectable languages, you can try to read the book as fast as you want using a modifiable WPM (Words per minute) setting.
While holding down the space bar/screen, it will quickly show you each word in a clean, not distracting interface.

## Personal Insights 🔬

The technique demonstrated here is arguably not the most beneficial for the highest comprehension or reading pleasure, but rather about raw numbers - pushing the human limit.
As someone who is between something of an auditory reader and a fully visual reader, this helps me shift more towards the latter, as my brain does not even have the time to "hear" the words.
Doing some basic experimenting, I am under the impression that I can read at ~750 wpm while remaining a more or less acceptable comprehension level (it's not very enjoyable though), without any special techniques I can go up to ~550 wpm; although a good book I really want to enjoy a lot slower.

## How was it build? 🪛

This project uses some very basic approaches. Everything runs on the frontend, so I can easily host it over Github Pages, the frontend runs some good old JQuery.
The JS just retrieves a random book, based on the preferred language, which are stored in this repository. They are downloaded using a simple python script and the [Gutendex](https://gutendex.com/) API access point to [Project Gutenberg](https://www.gutenberg.org).

## Contributing ℹ️

This is just a very easy project I developed on a single weekend and I do not really plan to further develop it as everything I wanted to implement is more or less implemented.
If you do have anything you'd really like to see or have something already developed, please feel very free to create a pull request or an issue. I am always happy to help and will try my best to implement any cool ideas!

## Acknowledgments 🙏

A very, very big thank you to the [Project Gutenberg](https://www.gutenberg.org); a free library with an incredible value for our public knowledge in my opinion.
It made this project possible, and even if my project would not exist, I'd still really have to thank Project Gutenberg just for its existence!
