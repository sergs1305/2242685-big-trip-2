import {EVENT_TYPES, EVENTS_COUNT, MIN_BASE_PRICE, MAX_BASE_PRICE, START_DATE, END_DATE, START_HOUR, END_HOUR, MIN_DURATION, MAX_DURATION} from '../const.js';
import {getRandomArrayElement, getRandomInteger, getRandomDate} from '../utils.js';
//import dayjs from 'dayjs';

const mockDestinations = [
  {
    id: 'd1',
    description: 'Sydney is the capital city of the state of New South Wales and the most populous city in Australia. Located on Australia\'s east coast, the metropolis surrounds Sydney Harbour and extends about 80 km (50 mi) from the Pacific Ocean in the east to the Blue Mountains in the west, and about 80 km (50 mi) from the Ku-ring-gai Chase National Park and the Hawkesbury River in the north and north-west, to the Royal National Park and Macarthur in the south and south-west. Greater Sydney consists of 658 suburbs, spread across 33 local government areas. Residents of the city are colloquially known as "Sydneysiders". The estimated population in June 2023 was 5,450,496, which is about 66% of the state\'s population. The city\'s nicknames include the Emerald City and the Harbour City.',
    name: 'Sydney',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/1920px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg',
        description: 'Jørn Utzon\'s Sydney Opera House, and the Harbour Bridge, two of Sydney\'s most famous landmarks, taken at late dusk. The Sydney Opera House is one of the most iconic buildings built in the 20th century (1973) and is UNESCO\'s world heritage.',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Bondi_1.jpg/1280px-Bondi_1.jpg',
        description: 'Bondi Beach',
      },
    ]
  },
  {
    id: 'd2',
    description: 'Melbourne is the capital and most populous city of the Australian state of Victoria, and the second-most populous city in Australia, after Sydney. Its name generally refers to a 9,993 km2 (3,858 sq mi) metropolitan area also known as Greater Melbourne, comprising an urban agglomeration of 31 local government areas. The name is also used to specifically refer to the local government area named City of Melbourne, whose area is centred on the Melbourne central business district and some immediate surrounds.',
    name: 'Melbourne',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Melburnian_Skyline_b.jpg/1280px-Melburnian_Skyline_b.jpg',
        description: 'Melbourne skyline',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Flinders_Street_Station_Melbourne_March_2021.jpg/1280px-Flinders_Street_Station_Melbourne_March_2021.jpg',
        description: 'Flinders Street Station in Melbourne with Eureka Tower and Australia 108 visible',
      },
    ]
  },
  {
    id: 'd3',
    description: 'Brisbane is the capital and largest city of the state of Queensland and the third-most populous city in Australia and Oceania, with a population over 2.7 million. Brisbane lies at the centre of South East Queensland, an urban agglomeration with a population of approximately 4 million which includes several other regional centres and cities. The central business district is situated within a peninsula of the Brisbane River about 15 km (9 mi) from its mouth at Moreton Bay. Brisbane is located in the hilly floodplain of the Brisbane River Valley between Moreton Island and the Taylor and D\'Aguilar mountain ranges. It sprawls across several local government areas, most centrally the City of Brisbane. The demonym of Brisbane is Brisbanite.',
    name: 'Brisbane',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Brisbane_CBD_from_Southbank_in_July_2024.jpg/1280px-Brisbane_CBD_from_Southbank_in_July_2024.jpg',
        description: 'Brisbane CBD from Southbank in July 2024',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Brisbane_City_Hall%2C_February_2023_%28cropped%29.jpg/800px-Brisbane_City_Hall%2C_February_2023_%28cropped%29.jpg',
        description: 'Brisbane City Hall, February 2023',
      },
    ]
  },
  {
    id: 'd4',
    description: 'Perth is the capital city of Western Australia. It is the fourth most populous city in Australia, with a population of over 2.3 million within Greater Perth as of 2023. It is part of the South West Land Division of Western Australia, with most of Perth\'s metropolitan area on the Swan Coastal Plain between the Indian Ocean and the Darling Scarp. The city has expanded outward from the original British settlements on the Swan River, upon which its central business district and port of Fremantle are situated.',
    name: 'Perth',
    pictures: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg/1920px-Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg',
        description: 'Perth CBD skyline from State War Memorial Lookout, 2023',
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Perth_town_hall_march21_%28cropped%29.jpg/800px-Perth_town_hall_march21_%28cropped%29.jpg',
        description: 'Perth Town hall',
      },
    ]
  },
];

// сделать массив доп. предложений генерируемым?
const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 'o1',
        title: 'Order Uber',
        price: 20,
      },
      {
        id: 'o2',
        title: 'Carry luggage',
        price: 25,
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 'o3',
        title: 'Add luggage',
        price: 15,
      },
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 'o4',
        title: 'Add luggage',
        price: 20,
      },
      {
        id: 'o5',
        title: 'Separate compartment',
        price: 100,
      },
      {
        id: 'o6',
        title: 'Add breakfast',
        price: 50,
      },
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 'o7',
        title: 'Add luggage',
        price: 20,
      },
      {
        id: 'o8',
        title: 'Stateroom',
        price: 100,
      },
      {
        id: 'o9',
        title: 'Add breakfast',
        price: 50,
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 'o10',
        title: 'Rent a car',
        price: 200,
      },
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'o11',
        title: 'Add luggage',
        price: 30,
      },
      {
        id: 'o12',
        title: 'Switch to comfort class',
        price: 100,
      },
      {
        id: 'o13',
        title: 'Add meal',
        price: 15,
      },
      {
        id: 'o14',
        title: 'Choose seats',
        price: 5,
      },
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 'o15',
        title: 'Add breakfast',
        price: 50,
      },
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 'o16',
        title: 'Book tickets',
        price: 20,
      },
      {
        id: 'o17',
        title: 'Add lunch',
        price: 50,
      },
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 'o18',
        title: 'Add wine',
        price: 50,
      },
    ]
  },
];

//заполнение массива mockEvents
const mockEvents = [];
for (let i = 0; i < EVENTS_COUNT; i++) {
  const eventType = getRandomArrayElement(EVENT_TYPES);
  const eventOffers = getEventOffers(eventType); //в зависимости от type
  const dateFrom = getRandomDate(START_DATE, END_DATE, START_HOUR, END_HOUR);
  const dateTo = Date(dateFrom.getTime() + getRandomInteger(MIN_DURATION, MAX_DURATION)); //д.б. позднее dateFrom
  mockEvents[i] = {
    id: `e${i}`,
    basePrice: getRandomInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
    dateFrom: dateFrom.toString(),
    dateTo: dateTo.toString(),
    destination: getRandomArrayElement(mockDestinations).id,
    isFavorite: false,
    offers: eventOffers,
    type: eventType,
  };
}

function getEventOffers(type) {
//возвращает массив offersIds для конкретного type
  const offers = mockOffers[mockOffers.findIndex((item) => item.type === type)]; //ищет элемент (объект) в массиве mockOffers по ключу type
  const offersIds = [];
  offers.forEach((offer) => {
    offersIds.push(offer.id);
  });
  return offersIds;
}

function getRandomEvent() {
  return getRandomArrayElement(mockEvents);
}
export {getRandomEvent};
