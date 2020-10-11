#include <stdio.h>
#include <cs50.h>
#include <string.h>

int main (void) {
    printf("\n\n\n");
    string s = get_string("Input: \n       $   ");
    for (float i = 0, length = strlen(s); i < length; i++) {
        printf("%c", (char) s[(int) i]);
    }
    printf("\n\n\n");
}