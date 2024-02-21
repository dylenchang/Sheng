const jsonData = [
  {
    id: 1,
    title: "Level 1 - Item 1",
    children: [
      {
        id: 2,
        title: "Level 2 - Item 1",
        children: [
          {
            id: 3,
            title: "Level 3 - Item 1",
            children: [
              {
                id: 4,
                title: "Level 4 - Item 1",
              },
              {
                id: 5,
                title: "Level 4 - Item 2",
              },
            ],
          },
        ],
      },
      {
        id: 6,
        title: "Level 2 - Item 2",
        children: [
          {
            id: 7,
            title: "Level 3 - Item 2",
            children: [
              {
                id: 8,
                title: "Level 4 - Item 3",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Level 1 - Item 2",
    children: [
      {
        id: 18,
        title: "Level 14 - Item 13",
      },
    ],
  },
];

export default jsonData;
