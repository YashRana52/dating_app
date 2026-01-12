"use client";
import { getCurrentLocation } from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";
import { MapPin, Search, X, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface LocationStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

function LocationStep({ profile, updateProfile }: LocationStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isLocationSet =
    profile.location.latitude !== 0 && profile.location.longitude !== 0;

  useEffect(() => {
    if (profile.location.address && !searchQuery) {
      setSearchQuery(profile.location.address);
    }
  }, [profile.location.address]);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=7&addressdetails=1`,
        {
          headers: {
            "User-Agent": "DatingApp/1.0 (+https://yourapp.com)",
          },
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowResults(true); // Still show dropdown to display "No results"
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      searchPlaces(value);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const selectPlace = (place: any) => {
    setShowResults(false);

    const getCity = () => {
      return (
        place.address?.city ||
        place.address?.town ||
        place.address?.village ||
        place.address?.suburb ||
        place.address?.hamlet ||
        place.address?.county ||
        place.address?.state_district ||
        "Location"
      );
    };

    const city = getCity();

    const locationData = {
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      city,
      state:
        place.address?.state ||
        place.address?.province ||
        place.address?.region ||
        "",
      country: place.address?.country || "",
      address: place.display_name,
    };

    updateProfile({ location: locationData });
    setSearchQuery(place.display_name);
  };

  const clearLocation = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    updateProfile({
      location: {
        latitude: 0,
        longitude: 0,
        city: "",
        state: "",
        country: "",
        address: "",
      },
    });
  };

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);

    try {
      const { lat: latitude, lng: longitude } = await getCurrentLocation();

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "DatingApp/1.0 (+https://yourapp.com)",
          },
        }
      );

      const data = await response.json();

      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.county ||
        "Current Location";

      const locationData = {
        latitude,
        longitude,
        city,
        state: data.address?.state || "",
        country: data.address?.country || "",
        address: data.display_name || `${city}, ${data.address?.country || ""}`,
      };

      updateProfile({ location: locationData });
      setSearchQuery(locationData.address);
      setShowResults(false);
    } catch (error: any) {
      console.error("Location error:", error);
      if (error.code === 1) {
        inputRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-400/30 via-purple-400/20 to-indigo-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-48 -right-32 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <div className="relative inline-block mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl opacity-60 animate-ping" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-6">
          Where are you located?
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300">
          Help others{" "}
          <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            find you nearby
          </span>{" "}
          by sharing your location
        </p>
      </div>

      {/* Main Input Area */}
      <div className="w-full max-w-2xl space-y-6">
        <Button
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          size="lg"
          className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Detecting your location...
            </>
          ) : (
            <>
              <MapPin className="mr-3 h-5 w-5" />
              Use My Current Location
            </>
          )}
        </Button>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          <span className="text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>

        {/* Search Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search for your city or address
          </label>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your city, area, or address..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg rounded-2xl"
              onFocus={() => searchQuery.trim() && setShowResults(true)}
            />
            {searchQuery && (
              <button
                onClick={clearLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-purple-600 z-10" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                searchResults.map((place) => {
                  const mainText =
                    place.address?.city ||
                    place.address?.town ||
                    place.address?.village ||
                    place.address?.suburb ||
                    place.address?.state ||
                    place.display_name.split(",")[0];

                  const secondaryText = place.display_name
                    .replace(mainText, "")
                    .replace(/^,\s*/, "")
                    .split(",")
                    .slice(0, 2)
                    .join(", ");

                  return (
                    <button
                      key={place.place_id}
                      onClick={() => selectPlace(place)}
                      className="w-full text-left px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <MapPin className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {mainText}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {secondaryText || place.display_name}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {isSearching ? "Searching..." : "No locations found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Location Preview */}
        {isLocationSet && profile.location.city && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 text-center border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your selected location
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {profile.location.city}
              {profile.location.state && `, ${profile.location.state}`}
              {profile.location.country && `, ${profile.location.country}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationStep;
