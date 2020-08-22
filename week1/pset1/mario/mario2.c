#include <stdio.h>
#include <cs50.h>

// Declaring functions to print out the right number of characters

void print_spaces();
void print_hashes();

int main(void)
{
    int userinput;

    // Get a positive integer from 1 to 8

    do
    {
        userinput = get_int("Please provide a height between 1 and 8: ");
    }
    while (userinput < 1 || userinput > 8);

    // Print out the pyramids

    for (int i = 1; i <= userinput; i++)
    {
        print_spaces(i, userinput);
        print_hashes(i);
        printf("  ");
        print_hashes(i);
        printf("\n");
    }
}

// Function definitions:

void print_spaces(int i, int userinput)
{
    for (int j = userinput - i; j > 0; j--)
    {
        printf(" ");
    }
}

void print_hashes(int i)
{
    for (int k = 0; k < i; k++)
    {
        printf("#");
    }
}