#include <stdio.h>
#include <cs50.h>
#include <math.h>

int main ()
{
    int change;
    do
    {
        change = round(get_float("Q: How much change is needed?    A: ") * 100);
    }
    while (change < 1);
    float remaining_change = change;
    int number_of_coins = 0;
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
    printf ("%i\n", number_of_coins);
}