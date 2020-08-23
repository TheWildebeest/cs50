#include <stdio.h>
#include <cs50.h>
#include <math.h>

int main()
{

	long get_card_number;
	long card_number;
	int card_number_length;
	int checksum = 0;

// Get user input

	do
	{
	get_card_number = get_long("Enter a credit card number:   # ");
	}
	while (get_card_number <= 0);

	// printf("\n\n%ld\n\n", get_card_number);

// Determine the card number and the length of the number.
// log10() method found by googling a way to get the length of
// a number in C, quite handy.)

	card_number = get_card_number;
	card_number_length = log10(get_card_number)+1;

	if (card_number_length != 13 && card_number_length != 15 && card_number_length != 16)
	{
		printf("INVALID\n");
		return 0;
	}

	// Loop through the digits and perform a calculation on each one
	long i;
	int k = 0;

	for (i = 1; i < pow(10, card_number_length); i = 10 * i)
	{
		int digit = (card_number / i) % 10;
		if (k == 0)
		{
			checksum += digit;
			// printf("Digit: %i\n", digit);
			// printf("Checksum: %i\n", checksum);
			k = 1;
		}
		else
		{
			int second_digit = (2 * digit) % 10;
			checksum += second_digit;
			int first_digit;
			// printf("New digit 2 * %i = %i\n", digit, digit*2);
			if (digit * 2 > 9)
			{
				first_digit = ((digit * 2) / 10) % 10;
				checksum += first_digit;
			    // printf("--Second digit: %i\n", second_digit);
				// printf("--First digit: %i\n", first_digit);
			}
			// printf("Checksum: %i\n", checksum);
			k = 0;
		}

	}

	if (checksum % 10 != 0)
	{
		printf("INVALID\n");
		return 0;
	}
	int initial_digits = card_number / pow(10, card_number_length -2);

	if (initial_digits == 51 || initial_digits == 52 || initial_digits == 53 || initial_digits == 54 || initial_digits == 55)
	{
		printf("MASTERCARD\n");
		return 0;
	}
		if (initial_digits == 34 || initial_digits == 37)
	{
		printf("AMEX\n");
		return 0;
	}
	if (initial_digits / 10 == 4)
	{
		printf("VISA\n");
		return 0;
	}
	printf("INVALID\n");
	return 0;

	// printf("Card number: %ld\n", card_number);
	// printf("Number of digits: %i\n", card_number_length);
	// printf("Checksum total: %i\n", checksum);
}