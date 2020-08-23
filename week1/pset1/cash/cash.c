// Headers

#include <stdio.h>
#include <cs50.h>
#include <math.h>

// Main program

int main()
{
    int change;

    // Get a valid input from the user:

    do
    {
        change = round(get_float("Q: How much change is needed?    A: ") * 100);
    }
    while (change < 1);

    // Initialize the remaining change and the counter:

    float remaining_change = change;
    int number_of_coins = 0;

    // Series of loops to divide the change into the smallest possible number of coins

    while (remaining_change >= 25)
    {
        remaining_change = remaining_change - 25;
        number_of_coins++;
    };
    while (remaining_change >= 10)
    {
        remaining_change = remaining_change - 10;
        number_of_coins++;
    };
    while (remaining_change >= 5)
    {
        remaining_change = remaining_change - 5;
        number_of_coins++;
    };
    while (remaining_change >= 2)
    {
        remaining_change = remaining_change - 2;
        number_of_coins++;
    };
    while (remaining_change >= 1)
    {
        remaining_change = remaining_change - 1;
        number_of_coins++;
    };
    printf("%i\n", number_of_coins);
}