import API from '@/configs/api';
import {
  fetchListThreads,
  setCategories,
  setListThreadsError,
  setListThreadsStatus,
  setThreadsList,
  setUsers,
} from './listThreadsSlice';
import ProcessingState from '@/types/processing-state.enum';
import { expect } from '@jest/globals';
import {
  ThreadsResponsesType,
  ThreadsWithUserType,
} from '@/types/threads-responses.interface';
import { ProfileResponsesType } from '@/types/profile-responses.interface';

/**
 * test scenario for listThreadSlice Thunk
 *
 * - fetchListThreads thunk function
 *  - should dispatch action correctly when data fetching success
 *  - should dispatch action correctly when data fetching failed
 *
 */

// Mocking API module
jest.mock('@/configs/api', () => ({
  getAllThreads: jest.fn(),
  getAllUsers: jest.fn(),
}));

const mockedAllThreadResponses: ThreadsResponsesType[] = [
  {
    id: 'thread-Np47p4jhUXYhrhRn',
    title: 'Bagaimana pengalamanmu belajar Redux?',
    body: 'Coba ceritakan dong, gimana pengalaman kalian belajar Redux di Dicoding?',
    category: 'redux',
    createdAt: '2023-05-29T07:55:52.266Z',
    ownerId: 'user-mQhLzINW_w5TxxYf',
    totalComments: 3,
    upVotesBy: [],
    downVotesBy: [],
  },
  {
    id: 'thread-91KocEqYPRz68MhD',
    title: 'Halo! Selamat datang dan silakan perkenalkan diri kamu',
    body: '<div>Bagaimana kabarmu? Semoga baik-baik saja ya. Sekali lagi saya ucapkan selamat datang semuanya!</div><div><br></div><div>Seperti yang sudah disampaikan sebelumnya, pada diskusi ini kamu bisa memperkenalkan diri kamu dan juga berkenalan dengan teman sekelas lainnya.</div><div><br></div><div>Berhubungan baik dengan teman sekelas dan instruktur merupakan bagian penting dari pembelajaran di kelas ini, karena mereka dapat membantu jika kamu mengalami kendala dalam mempelajari dan memahami materi.&nbsp;&nbsp;</div><div><br></div><div>Oleh karena itu, luangkanlah waktumu untuk saling mengenal dan mencairkan suasana. Membangun interaksi dengan siswa lain akan membuat pengalaman belajar kamu jauh lebih menyenangkan dan menarik.&nbsp;</div><div><br></div><div>Beberapa hal yang dapat kamu tulis pada perkenalan diri:</div><div><br></div><div>- Siapa kamu dan dari mana kamu berasal?</div><div>- Apa pekerjaan atau pendidikan kamu saat ini?</div><div>- Kenapa kamu mengambil pelatihan ini? Apakah mungkin karena kamu sedang mengejar perubahan dalam karir, atau lainnya?</div>',
    category: 'perkenalan',
    createdAt: '2023-05-29T07:54:35.746Z',
    ownerId: 'user-aROWej8yYA1sOfHN',
    totalComments: 1,
    upVotesBy: ['user-mQhLzINW_w5TxxYf'],
    downVotesBy: [],
  },
];
const mockedAllUsersResponses: ProfileResponsesType[] = [
  {
    id: 'user-mQhLzINW_w5TxxYf',
    name: 'Dimas Saputra',
    email: 'dimas@dicoding.com',
    avatar: 'https://ui-avatars.com/api/?name=Dimas Saputra&background=random',
  },
  {
    id: 'user-aROWej8yYA1sOfHN',
    name: 'Dicoding',
    email: 'admin@dicoding.com',
    avatar: 'https://ui-avatars.com/api/?name=Dicoding&background=random',
  },
];

describe('fetchListThreads thunk function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const dispatch = jest.fn();

    const mockedResponseThreads = {
      data: { data: { threads: mockedAllThreadResponses } },
    };
    const mockedResponseUsers = {
      data: { data: { users: mockedAllUsersResponses } },
    };

    const threadsWithUser: ThreadsWithUserType[] = mockedAllThreadResponses.map(
      (item) => {
        return {
          ...item,
          user: mockedAllUsersResponses.find(
            (user) => user.id === item.ownerId,
          ),
        };
      },
    );

    const listCategory = mockedAllThreadResponses.map((item) => item.category);
    const uniqueCategory = [...new Set(listCategory)];

    (API.getAllThreads as jest.Mock).mockResolvedValueOnce(
      mockedResponseThreads,
    );
    (API.getAllUsers as jest.Mock).mockResolvedValueOnce(mockedResponseUsers);

    await fetchListThreads()(dispatch);

    expect(API.getAllThreads).toHaveBeenCalled();
    expect(API.getAllUsers).toHaveBeenCalled();

    expect(dispatch).toHaveBeenCalledWith(
      setListThreadsStatus({ status: ProcessingState.IN_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setListThreadsError({ error: '' }));

    expect(dispatch).toHaveBeenCalledWith(
      setThreadsList({ list: threadsWithUser }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUsers({ list: mockedAllUsersResponses }),
    );

    expect(dispatch).toHaveBeenCalledWith(
      setCategories({ list: uniqueCategory }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setListThreadsStatus({ status: ProcessingState.SUCCESS }),
    );
  });

  it('should dispatch action correctly when data fetching failed', async () => {
    const dispatch = jest.fn();
    const errorMessage = '500 Server Error';
    (API.getAllThreads as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await fetchListThreads(true)(dispatch);

    expect(API.getAllThreads).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setListThreadsStatus({ status: ProcessingState.BG_PROGRESS }),
    );
    expect(dispatch).toHaveBeenCalledWith(setListThreadsError({ error: '' }));

    expect(dispatch).toHaveBeenCalledWith(setCategories({ list: [] }));
    expect(dispatch).toHaveBeenCalledWith(setThreadsList({ list: [] }));
    expect(dispatch).toHaveBeenCalledWith(
      setListThreadsError({ error: expect.any(String) as unknown as string }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setListThreadsStatus({ status: ProcessingState.FAILURE }),
    );
  });
});
