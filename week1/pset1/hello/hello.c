#include <stdio.h>
#include <cs50.h>

int main(void)
{
    string name = get_string("What's yer name?     --->");
    printf("Hello, %s\n", name);

}