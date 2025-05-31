import React, { useState, useEffect } from 'react';
import { FaClock, FaGlobeAmericas, FaExchangeAlt, FaPlus, FaTrash } from 'react-icons/fa';
import AdBanner from '../../layout/AdBanner';
import SEO from '../../layout/SEO';

const TimeZoneConverter = () => {
  const [sourceDateTime, setSourceDateTime] = useState('');
  const [sourceTimeZone, setSourceTimeZone] = useState('');
  const [targetTimeZones, setTargetTimeZones] = useState([{ id: 1, zone: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [useCurrentTime, setUseCurrentTime] = useState(false);

  // List of time zones
  const timeZones = [
    { id: 'UTC', name: 'UTC (Coordinated Universal Time)', offset: 0 },
    { id: 'America/New_York', name: 'EST/EDT - New York (UTC-5/UTC-4)', offset: -5 },
    { id: 'America/Chicago', name: 'CST/CDT - Chicago (UTC-6/UTC-5)', offset: -6 },
    { id: 'America/Denver', name: 'MST/MDT - Denver (UTC-7/UTC-6)', offset: -7 },
    { id: 'America/Los_Angeles', name: 'PST/PDT - Los Angeles (UTC-8/UTC-7)', offset: -8 },
    { id: 'America/Anchorage', name: 'AKST/AKDT - Anchorage (UTC-9/UTC-8)', offset: -9 },
    { id: 'Pacific/Honolulu', name: 'HST - Honolulu (UTC-10)', offset: -10 },
    { id: 'Europe/London', name: 'GMT/BST - London (UTC+0/UTC+1)', offset: 0 },
    { id: 'Europe/Paris', name: 'CET/CEST - Paris (UTC+1/UTC+2)', offset: 1 },
    { id: 'Europe/Berlin', name: 'CET/CEST - Berlin (UTC+1/UTC+2)', offset: 1 },
    { id: 'Europe/Moscow', name: 'MSK - Moscow (UTC+3)', offset: 3 },
    { id: 'Asia/Dubai', name: 'GST - Dubai (UTC+4)', offset: 4 },
    { id: 'Asia/Kolkata', name: 'IST - India (UTC+5:30)', offset: 5.5 },
    { id: 'Asia/Shanghai', name: 'CST - China (UTC+8)', offset: 8 },
    { id: 'Asia/Tokyo', name: 'JST - Tokyo (UTC+9)', offset: 9 },
    { id: 'Australia/Sydney', name: 'AEST/AEDT - Sydney (UTC+10/UTC+11)', offset: 10 },
    { id: 'Pacific/Auckland', name: 'NZST/NZDT - Auckland (UTC+12/UTC+13)', offset: 12 }
  ];

  // Set current time when "Use Current Time" is checked
  useEffect(() => {
    if (useCurrentTime) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      setSourceDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [useCurrentTime]);

  const handleAddTimeZone = () => {
    const newId = targetTimeZones.length > 0 ? Math.max(...targetTimeZones.map(tz => tz.id)) + 1 : 1;
    setTargetTimeZones([...targetTimeZones, { id: newId, zone: '' }]);
  };

  const handleRemoveTimeZone = (id) => {
    if (targetTimeZones.length > 1) {
      setTargetTimeZones(targetTimeZones.filter(tz => tz.id !== id));
    }
  };

  const handleTimeZoneChange = (id, value) => {
    setTargetTimeZones(targetTimeZones.map(tz => {
      if (tz.id === id) {
        return { ...tz, zone: value };
      }
      return tz;
    }));
  };

  const handleConvert = () => {
    setError('');
    setResults([]);

    // Validate inputs
    if (!sourceDateTime) {
      setError('Please enter a date and time');
      return;
    }

    if (!sourceTimeZone) {
      setError('Please select a source time zone');
      return;
    }

    const validTargetTimeZones = targetTimeZones.filter(tz => tz.zone);
    if (validTargetTimeZones.length === 0) {
      setError('Please select at least one target time zone');
      return;
    }

    try {
      // Parse source date and time
      const sourceDate = new Date(sourceDateTime);
      
      // Check if date is valid
      if (isNaN(sourceDate.getTime())) {
        setError('Please enter a valid date and time');
        return;
      }

      // Get source time zone info
      const sourceZoneInfo = timeZones.find(tz => tz.id === sourceTimeZone);
      if (!sourceZoneInfo) {
        setError('Invalid source time zone');
        return;
      }

      // Calculate conversions
      const conversions = validTargetTimeZones.map(targetTz => {
        const targetZoneInfo = timeZones.find(tz => tz.id === targetTz.zone);
        if (!targetZoneInfo) return null;

        // Create a new date object for the target time zone
        const targetDate = new Date(sourceDate);
        
        // Convert to UTC first
        const sourceOffsetMinutes = getTimeZoneOffset(sourceZoneInfo.id, sourceDate);
        targetDate.setMinutes(targetDate.getMinutes() - sourceOffsetMinutes);
        
        // Then convert to target time zone
        const targetOffsetMinutes = getTimeZoneOffset(targetZoneInfo.id, targetDate);
        targetDate.setMinutes(targetDate.getMinutes() + targetOffsetMinutes);

        // Calculate time difference
        const hourDifference = (targetOffsetMinutes - sourceOffsetMinutes) / 60;
        const diffText = hourDifference > 0 
          ? `${hourDifference} hour${hourDifference !== 1 ? 's' : ''} ahead` 
          : hourDifference < 0 
            ? `${Math.abs(hourDifference)} hour${Math.abs(hourDifference) !== 1 ? 's' : ''} behind` 
            : 'same time';

        return {
          id: targetTz.id,
          zoneName: targetZoneInfo.name,
          dateTime: targetDate,
          formattedDateTime: formatDateTime(targetDate),
          formattedDate: formatDate(targetDate),
          formattedTime: formatTime(targetDate),
          dayDifference: getDayDifference(sourceDate, targetDate),
          timeDifference: diffText
        };
      }).filter(Boolean);

      setResults([
        {
          id: 'source',
          zoneName: sourceZoneInfo.name,
          dateTime: sourceDate,
          formattedDateTime: formatDateTime(sourceDate),
          formattedDate: formatDate(sourceDate),
          formattedTime: formatTime(sourceDate),
          dayDifference: 'Same day',
          timeDifference: 'Reference time'
        },
        ...conversions
      ]);
    } catch (err) {
      setError('Error converting time: ' + err.message);
    }
  };

  // Helper function to get time zone offset in minutes
  const getTimeZoneOffset = (timeZoneId, date) => {
    try {
      // This is a simplified approach since we can't use Intl.DateTimeFormat().resolvedOptions() in this context
      // In a real implementation, you would use the browser's time zone capabilities or a library like moment-timezone
      const timeZoneInfo = timeZones.find(tz => tz.id === timeZoneId);
      if (!timeZoneInfo) return 0;
      
      // Basic offset in minutes
      let offsetMinutes = timeZoneInfo.offset * 60;
      
      // Handle half-hour offsets
      if (timeZoneInfo.offset % 1 !== 0) {
        offsetMinutes = Math.floor(offsetMinutes) + ((timeZoneInfo.offset % 1) * 60);
      }
      
      // Very simplified DST detection (not accurate for all time zones)
      // In a real implementation, you would use a proper time zone library
      const month = date.getMonth();
      // Northern hemisphere summer (April to October)
      if (month >= 3 && month <= 9) {
        // Add 1 hour for DST for time zones that observe it
        if (['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 
             'America/Anchorage', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
             'Australia/Sydney', 'Pacific/Auckland'].includes(timeZoneId)) {
          offsetMinutes += 60;
        }
      }
      
      return offsetMinutes;
    } catch (error) {
      console.error('Error calculating time zone offset:', error);
      return 0;
    }
  };

  // Helper function to format date and time
  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format date only
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Helper function to format time only
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to determine day difference
  const getDayDifference = (sourceDate, targetDate) => {
    const sourceDay = new Date(sourceDate.getFullYear(), sourceDate.getMonth(), sourceDate.getDate());
    const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = targetDay - sourceDay;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return 'Next day';
    if (diffDays === -1) return 'Previous day';
    if (diffDays > 1) return `${diffDays} days ahead`;
    return `${Math.abs(diffDays)} days behind`;
  };

  const handleReset = () => {
    setSourceDateTime('');
    setSourceTimeZone('');
    setTargetTimeZones([{ id: 1, zone: '' }]);
    setResults([]);
    setError('');
    setUseCurrentTime(false);
  };

  return (
    <>
      <SEO
        title="Time Zone Converter"
        description="Convert times between different time zones around the world. Perfect for scheduling international meetings and calls."
        keywords="time zone converter, world clock, international time, meeting planner, time difference calculator"
      />

      <div className="calculator-container">
        <h1 className="calculator-title">Time Zone Converter</h1>
        <p className="calculator-description">
          Convert times between different time zones around the world. Perfect for scheduling international meetings and calls.
        </p>

        <AdBanner position="top" />

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="sourceDateTime" className="block text-sm font-medium text-gray-700 mb-1">
                Date and Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="sourceDateTime"
                  value={sourceDateTime}
                  onChange={(e) => {
                    setSourceDateTime(e.target.value);
                    setUseCurrentTime(false);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={useCurrentTime}
                    onChange={(e) => setUseCurrentTime(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Use current time</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="sourceTimeZone" className="block text-sm font-medium text-gray-700 mb-1">
                From Time Zone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobeAmericas className="text-gray-400" />
                </div>
                <select
                  id="sourceTimeZone"
                  value={sourceTimeZone}
                  onChange={(e) => setSourceTimeZone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a time zone</option>
                  {timeZones.map(tz => (
                    <option key={tz.id} value={tz.id}>
                      {tz.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
              <FaExchangeAlt className="mr-2 text-primary-600" /> To Time Zones
            </h3>
            
            {targetTimeZones.map((tz) => (
              <div key={tz.id} className="flex space-x-2 mb-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobeAmericas className="text-gray-400" />
                  </div>
                  <select
                    value={tz.zone}
                    onChange={(e) => handleTimeZoneChange(tz.id, e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select a time zone</option>
                    {timeZones.map(timeZone => (
                      <option key={timeZone.id} value={timeZone.id}>
                        {timeZone.name}
                      </option>
                    ))}
                  </select>
                </div>
                {targetTimeZones.length > 1 && (
                  <button
                    onClick={() => handleRemoveTimeZone(tz.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    title="Remove time zone"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={handleAddTimeZone}
              className="mt-2 flex items-center text-primary-600 hover:text-primary-800 font-medium"
            >
              <FaPlus className="mr-1" /> Add Another Time Zone
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleConvert}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out flex items-center justify-center"
          >
            <FaExchangeAlt className="mr-2" /> Convert Time Zones
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out"
          >
            Reset
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaClock className="mr-2 text-primary-600" /> Time Zone Conversion Results
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Time Zone</th>
                    <th className="py-2 px-4 border-b text-left">Date & Time</th>
                    <th className="py-2 px-4 border-b text-left">Day</th>
                    <th className="py-2 px-4 border-b text-left">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr 
                      key={result.id} 
                      className={`${index === 0 ? 'bg-blue-50' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 border-b">
                        <div className="font-medium">{result.zoneName.split(' - ')[1] || result.zoneName}</div>
                        <div className="text-xs text-gray-500">{result.zoneName.split(' - ')[0]}</div>
                      </td>
                      <td className="py-3 px-4 border-b">
                        <div className="font-medium">{result.formattedTime}</div>
                        <div className="text-xs text-gray-500">{result.formattedDate}</div>
                      </td>
                      <td className="py-3 px-4 border-b">
                        {result.dayDifference}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {result.timeDifference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">About Time Zone Conversion</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              This calculator helps you convert times between different time zones around the world. It's useful for scheduling international meetings, calls, or events.
            </p>
            <p>
              Note that time zone rules can change due to daylight saving time transitions. This calculator provides approximate conversions based on standard offsets and simplified DST rules.
            </p>
            <p>
              For the most accurate results, especially for dates far in the future, verify the conversion with official sources or time zone databases.
            </p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>
    </>
  );
};

export default TimeZoneConverter;
