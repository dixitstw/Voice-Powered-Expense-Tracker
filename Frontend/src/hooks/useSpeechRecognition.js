import { useState, useEffect, useCallback } from "react";
import formatDate from "../utils/formatDate";

const useSpeechRecognition = (formData, setFormData) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  const VALID_INCOME_CATEGORIES = [
    "Business",
    "Investments",
    "Extra Income",
    "Deposits",
    "Lottery",
    "Gifts",
    "Salary",
    "Savings",
    "Rental Income",
  ];

  const VALID_EXPENSE_CATEGORIES = [
    "Bills",
    "Car",
    "Clothes",
    "Travel",
    "Food",
    "Shopping",
    "House",
    "Entertainment",
    "Phone",
    "Pets",
    "Other",
  ];

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      setRecognition(recognitionInstance);
    }
  }, []);

  const validateCategory = (type, category) => {
    const validCategories =
      type.toLowerCase() === "income"
        ? VALID_INCOME_CATEGORIES
        : VALID_EXPENSE_CATEGORIES;

    const formattedInputCategory = category
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return validCategories.includes(formattedInputCategory);
  };

  const parseCommand = useCallback((text) => {
    const command = text.toLowerCase();

    // Updated pattern to better handle dates
    const patterns = [
      /(?:add|create|record)\s+(income|expense)\s+(?:for|of)\s+(?:\$?(\d+)|(?:(?:dollars|dollar)\s+(\d+)|(\d+)\s+(?:dollars|dollar))|(?:(?:dollars|dollar)\s+(\d+)))\s+(?:in|under)\s+(?:category\s+)?([a-zA-Z\s]+?)(?:\s+(?:for|on)\s+(.+?))?(?:\s*$)/i,
    ];

    let match = null;
    for (const pattern of patterns) {
      match = command.match(pattern);
      if (match) break;
    }

    if (match) {
      const [, type, amount1, amount2, amount3, amount4, category, date] =
        match;
      const amount = amount1 || amount2 || amount3 || amount4;

      if (!category || category.trim().toLowerCase() === "category") {
        console.log("No valid category provided");
        return null;
      }

      const formattedCategory = category
        .trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      if (!validateCategory(type, formattedCategory)) {
        console.log("Invalid category:", formattedCategory);
        return null;
      }

      // Process the date
      let parsedDate;
      if (date && date.trim()) {
        try {
          const dateLower = date.toLowerCase().trim();

          if (dateLower === "today") {
            parsedDate = new Date();
          } else if (dateLower === "tomorrow") {
            parsedDate = new Date();
            parsedDate.setDate(parsedDate.getDate() + 1);
          } else if (dateLower === "yesterday") {
            parsedDate = new Date();
            parsedDate.setDate(parsedDate.getDate() - 1);
          } else {
            const daysOfWeek = {
              sunday: 0,
              monday: 1,
              tuesday: 2,
              wednesday: 3,
              thursday: 4,
              friday: 5,
              saturday: 6,
            };

            if (daysOfWeek.hasOwnProperty(dateLower)) {
              parsedDate = new Date();
              const currentDay = parsedDate.getDay();
              const targetDay = daysOfWeek[dateLower];
              const daysToAdd = (targetDay + 7 - currentDay) % 7;
              parsedDate.setDate(parsedDate.getDate() + daysToAdd);
            } else {
              const dateAttempts = [
                // Try parsing as is
                new Date(date),
                // Try parsing with current year
                new Date(`${date} ${new Date().getFullYear()}`),
                // Try parsing American format (MM/DD)
                new Date(`${date}/${new Date().getFullYear()}`),
                // Try parsing European format (DD/MM)
                new Date(date.split("/").reverse().join("/")),
              ];

              parsedDate =
                dateAttempts.find((d) => !isNaN(d.getTime())) || new Date();

              // If the parsed date is valid but in a different year
              if (
                !isNaN(parsedDate.getTime()) &&
                !date.includes(parsedDate.getFullYear().toString()) &&
                parsedDate.getFullYear() !== new Date().getFullYear()
              ) {
                parsedDate.setFullYear(new Date().getFullYear());
              }
            }
          }
        } catch (e) {
          console.log("Date parsing error:", e);
          parsedDate = new Date();
        }
      } else {
        parsedDate = new Date();
      }

      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount: amount,
        category: formattedCategory,
        date: formatDate(parsedDate),
      };
    }

    return null;
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);

        const parsedCommand = parseCommand(text);
        if (parsedCommand) {
          setFormData(parsedCommand);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, [recognition, parseCommand, setFormData]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  };
};

export default useSpeechRecognition;
