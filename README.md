# Rick and Morty App

A React Native app built with the [Rick and Morty API](https://rickandmortyapi.com/).

## Features

- Browse characters with infinite scroll, search (300ms debounce), and status/gender filters
- Character detail screen with full info and episode list
- Episodes grouped by season
- Locations list with resident character grid
- Save/remove favourites persisted with SQLite (accessible offline)
- Animated tab bar that hides/shows on scroll
- Dark / light theme toggle
- Toast notification system
- Skeleton loading states throughout

## Tech Stack

| Library | Purpose |
|---|---|
| React Native 0.85 | Framework |
| TypeScript (strict) | Language |
| @tanstack/react-query | Server state, caching, infinite pagination |
| Axios | HTTP client |
| Redux Toolkit | Favourites & UI filter state |
| react-native-quick-sqlite | Favourites persistence (SQLite) |
| @react-navigation/native | Navigation (stack + bottom tabs) |
| react-native-heroicons | Icons |

## Project Structure

```
src/
  features/
    characters/     # Character list, detail, filter modal, skeletons
    episodes/       # Episodes list grouped by season
    locations/      # Locations list and detail with residents
    favourites/     # Offline favourites screen
  services/         # Axios API layer (character, episode, location)
  store/            # Redux store, favouritesSlice, uiSlice
  hooks/            # useDebounce, useScrollHeader, useAppDispatch
  context/          # ThemeContext, TabBarContext, ToastContext
  types/            # TypeScript interfaces (API + navigation)
  utils/            # SQLite database helpers
  constants/        # App strings
  app/navigation/   # RootNavigator (bottom tabs + nested stacks)
```

## Setup

```bash
yarn install
```

**iOS:**
```bash
cd ios && pod install && cd ..
yarn ios
```

**Android:**
```bash
yarn android
```

## Start Metro

```bash
yarn start
```

## Running Tests

```bash
yarn test
```
