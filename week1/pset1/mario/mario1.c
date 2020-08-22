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

    for (int i = 1; i <= userinput; i++)
    {
        for (int j = userinput - i; j > 0; j--)
        {
            printf(" ");
        }
        for (int k = 0; k < i; k++)
        {
            printf("#");
        }
        printf("\n");
    }
}