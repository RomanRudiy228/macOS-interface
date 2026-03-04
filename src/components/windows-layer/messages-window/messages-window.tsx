"use client";

import React from "react";

export const MessagesWindow: React.FC = () => {
  return (
    <div className="flex h-full bg-white dark:bg-slate-800">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-slate-600 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Messages
          </h1>
          <div className="flex space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-slate-600">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200 dark:divide-slate-600">
            {/* Active conversation */}
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 cursor-pointer">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">Анна</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">10:30</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                  Привіт! Як твої справи?
                </p>
              </div>
            </div>

            {/* Other conversations */}
            <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                B
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">Богдан</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">09:15</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                  Доброго дня! Маю питання щодо проекту.
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                C
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">Катя</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Вчора</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                  Дякую за допомогу!
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                D
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate">Дмитро</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Пн</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-300 truncate">
                  Зустрінемося завтра?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
              A
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-slate-100">Анна</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Active now</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-4 h-4 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sample messages */}
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
              <p>Привіт! Як твої справи?</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">10:28</p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-blue-500 text-white">
              <p>Привіт! Усе добре, дякую. А в тебе?</p>
              <p className="text-xs opacity-70 mt-1">10:29</p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100">
              <p>Теж непогано. Працюю над проектом.</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">10:30</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-600">
          <div className="flex items-end space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <div className="flex-1">
              <input
                type="text"
                placeholder="iMessage"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
              <svg className="w-5 h-5 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};