import axios from "axios";
import React, { useEffect, useState } from "react";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 giờ flash sale
  const [holidayName, setHolidayName] = useState("");
  const [currentTimeFrame, setCurrentTimeFrame] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // Để kiểm tra trạng thái hiển thị

  const timeFrames = [
    { start: 9, end: 11, label: "Morning Deals" },
    { start: 14, end: 16, label: "Afternoon Specials" },
    { start: 20, end: 22, label: "Night Flash Sale" },
  ];

  useEffect(() => {
    const checkSpecialDay = async () => {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;

      try {
        const response = await axios.get(
          "https://date.nager.at/api/v3/PublicHolidays/2025/VN"
        );
        const holidays = response.data;
        const todayHoliday = holidays.find(
          (holiday) =>
            new Date(holiday.date).getDate() === day &&
            new Date(holiday.date).getMonth() + 1 === month
        );

        if (todayHoliday) {
          setHolidayName(todayHoliday.localName);
        } else if ([5, 15, 27].includes(day)) {
          setHolidayName("Flash Sale Special Day");
        }
      } catch (error) {
        console.error("Error fetching holidays", error);
      }
    };

    checkSpecialDay();
  }, []);

  useEffect(() => {
    const now = new Date().getHours();
    const activeTimeFrame = timeFrames.find(
      (frame) => now >= frame.start && now < frame.end
    );
    setCurrentTimeFrame(activeTimeFrame);

    if (activeTimeFrame) {
      const remainingTime =
        (activeTimeFrame.end - now) * 3600 - new Date().getMinutes() * 60;
      setTimeLeft(remainingTime);
      setIsVisible(true); // Hiển thị Flash Sale khi có khung giờ hợp lệ
    } else {
      setIsVisible(false); // Ẩn Flash Sale nếu không nằm trong khung giờ
    }

    const timer = setInterval(() => {
      if (isVisible) {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer); // Xoá timer khi component unmount hoặc không hiển thị
  }, [isVisible]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Nếu không có ngày lễ và không trong khung giờ flash sale, không render component
  if (!holidayName && !currentTimeFrame) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-md shadow-lg my-4 bg-white text-gray-800">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        🔥 Flash Sale {holidayName && `- ${holidayName}`}{" "}
        {currentTimeFrame ? `(${currentTimeFrame.label})` : ""}
      </h2>
      <p className="text-sm">
        {holidayName
          ? `Celebrate ${holidayName} with exclusive offers!`
          : `Don't miss out on our ${currentTimeFrame?.label || "deals"}!`}
      </p>
      <div className="text-2xl font-semibold mt-2 text-red-600">
        Time Left: {formatTime(timeLeft)}
      </div>
      <button className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 hover:scale-105 transition-transform">
        Shop Now
      </button>
    </div>
  );
};

export default FlashSale;
