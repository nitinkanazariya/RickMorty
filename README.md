# Rick and Morty App

A React Native application built with the [Rick and Morty API](https://rickandmortyapi.com/).

## Features

- Browse all characters with infinite scroll
- Search characters with 300ms debounce
- Filter by status and gender
- Character detail with episode list
- Save/remove favourites (persisted with SQLite)
- Browse all episodes grouped by season
- Browse all locations with resident details
- Offline favourites screen
- Animated header hide/show on scroll

## Tech Stack

| Library | Purpose |
|---|---|
| React Native 0.85 | Framework |
| TypeScript (strict) | Language |
| @tanstack/react-query | Data fetching & caching |
| Axios | HTTP client |
| Redux Toolkit | Global UI state |
| @op-engineering/op-sqlite | Local SQLite persistence |
| @react-navigation/native | Navigation |
| react-native-reanimated | Animations |

## Project Structure

```
src/
  features/
    characters/     # Character list, detail, components
    episodes/       # Episodes list
    locations/      # Locations list and detail
    favourites/     # Offline favourites screen
  services/         # Axios API calls
  store/            # Redux slices
  hooks/            # useDebounce, useScrollHeader, useAppDispatch
  types/            # TypeScript interfaces
  utils/            # SQLite database helpers
  app/navigation/   # React Navigation setup
```

## Setup

```bash
npm install
```

**iOS:**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

**Android:**
```bash
npx react-native run-android
```

## Running Tests

```bash
npm test
```

## Known Limitations

- `react-native-fast-image` does not support React 19 — progressive image loading is implemented manually using the built-in `Image` component with a placeholder state
- Shared element transitions are not implemented; card press scale animation via Reanimated is included instead
