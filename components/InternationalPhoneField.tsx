"use client";

import { useMemo, useState } from "react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

type CountryOption = {
  country: CountryCode;
  label: string;
};

export function InternationalPhoneField({
  country,
  number,
  error,
  onCountryChange,
  onNumberChange,
}: {
  country: string;
  number: string;
  error?: string;
  onCountryChange: (country: string) => void;
  onNumberChange: (number: string) => void;
}) {
  const options = useMemo<CountryOption[]>(() => {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return getCountries()
      .map((countryCode) => {
        const name = displayNames.of(countryCode) || countryCode;
        return {
          country: countryCode,
          label: `${name} (+${getCountryCallingCode(countryCode)})`,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "en"));
  }, []);

  const selectedOption = options.find((option) => option.country === country);
  const [countrySearch, setCountrySearch] = useState(selectedOption?.label || "");

  function selectCountry(value: string) {
    setCountrySearch(value);
    const match = options.find((option) => option.label === value);
    onCountryChange(match?.country || "");
  }

  return (
    <fieldset className="field phone-field">
      <legend>
        WhatsApp Number <span aria-hidden="true">*</span>
      </legend>
      <div className="phone-input-grid">
        <div className="phone-control">
          <label htmlFor="whatsapp-country">Country / calling code</label>
          <input
            id="whatsapp-country"
            name="whatsapp_country_selector"
            type="search"
            list="whatsapp-country-options"
            autoComplete="off"
            spellCheck={false}
            value={countrySearch}
            onChange={(event) => selectCountry(event.target.value)}
            placeholder="Search country or code"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="whatsapp-country-options"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "whatsapp-error" : "whatsapp-help"}
          />
          <datalist id="whatsapp-country-options">
            {options.map((option) => (
              <option key={option.country} value={option.label} />
            ))}
          </datalist>
        </div>

        <div className="phone-control">
          <label htmlFor="whatsapp">Phone number</label>
          <input
            id="whatsapp"
            name="whatsapp_national_number"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={number}
            onChange={(event) => onNumberChange(event.target.value)}
            placeholder="National phone number"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "whatsapp-error" : "whatsapp-help"}
          />
        </div>
      </div>
      <span className="field-hint" id="whatsapp-help">
        Select your country first; no country is selected automatically.
      </span>
      {error && (
        <span className="field-error" id="whatsapp-error">
          {error}
        </span>
      )}
    </fieldset>
  );
}
