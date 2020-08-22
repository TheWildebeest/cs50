#include <stdio.h>
#include <cs50.h>

int main(void)
{
    int userinput;

    do
    {
    userinput = get_int("Please provide a height between 1 and 8: ");
    }
    while(userinput < 1 || userinput > 8);

    printf("%i\n", userinput);
}