import { writable } from 'svelte/store'

export const questions = writable([
  {
    id: 1,
    question: `What's more reactive Svelte, React, or Angular?`,
    answers: [
      {
        text: 'Svelte',
        votes: 28,
      },

      {
        text: 'React',
        votes: 20,
      },

      {
        text: 'Angular',
        votes: 0,
      },
    ],
  },

  {
    id: 2,
    question: `What's better to write Svelte, React, or Angular?`,
    answers: [
      {
        text: 'Svelte',
        votes: 18,
      },

      {
        text: 'React',
        votes: 10,
      },

      {
        text: 'Angular',
        votes: 0,
      },
    ],
  },
])
