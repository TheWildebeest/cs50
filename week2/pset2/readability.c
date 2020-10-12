#include <stdio.h>
#include <cs50.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

int count_letters(string);
int get_words_total(string source_text);
int get_letters_total(string source_text);
int get_sentences_total(string source_text);
int get_coleman_liau_index(float L, float S);

int main(void)
{
    // Get user input

    printf("Text: ");
    string source_text = get_string("");

    // Get number of words
    int words_total = get_words_total(source_text);
    // Get number of letters
    int letters_total = get_letters_total(source_text);
    // Get number of sentences
    int sentences_total = get_sentences_total(source_text);
    // Calculate L
    float L = (float) letters_total / (float) words_total * 100;
    // Calculate S
    float S = (float) sentences_total / (float) words_total * 100;
    // Calculate Coleman-Liau Index
    int coleman_liau_index = get_coleman_liau_index(L, S);

    // Checks
    // printf("Total length: %i\n", (int) strlen(source_text));
    // printf("Total letters: %i\n", letters_total);
    // printf("Total words: %i\n", words_total);
    // printf("Total sentences: %i\n", sentences_total);
    // printf("Value of L: %f\n", L);
    // printf("Value of S: %f\n", S);
    // printf("Coleman_Liau Index: %i\n", coleman_liau_index);

    // Output:
    if (coleman_liau_index == 0)
    {
        printf("Before Grade 1\n");
    }
    else if (coleman_liau_index == 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", coleman_liau_index);
    }


    return 0;
}

int get_words_total(string source_text)
{
    int spaces_total = 0;
    for (int index = 0, chars = strlen(source_text); index < chars; index++)
    {
        if ((isspace(source_text[index])) && (!isspace(source_text[index + 1])))
        {
            spaces_total++;
        }
    }
    int words_total = spaces_total + 1;
    return words_total;
}

int get_letters_total(string source_text)
{
    int letters_total = 0;
    for (int index = 0, chars = strlen(source_text); index < chars; index++)
    {
        if (isalpha(source_text[index]))
        {
            letters_total++;
        }
    }
    return letters_total;
}

int get_sentences_total(string source_text)
{
    int sentences_total = 0;
    for (int index = 0, chars = strlen(source_text); index < chars; index++)
    {
        if ((source_text[index] == '!' || source_text[index] == '?' || source_text[index] == '.')
            &&
            (source_text[index + 1] == '\0' || isspace(source_text[index + 1])))
        {
            sentences_total++;
        }
    }
    if (sentences_total == 0)
    {
        sentences_total = 1;
    }
    return sentences_total;
}

int get_coleman_liau_index(float L, float S)
{
    int grade = round(0.0588 * L - 0.296 * S - 15.8);
    if (grade < 1)
    {
        grade = 0;
    }
    else if (grade > 16)
    {
        grade = 16;
    }
    return grade;
}