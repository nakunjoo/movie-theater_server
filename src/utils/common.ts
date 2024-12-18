import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';
import dayjs from './dayjs';
import * as fs from 'fs';

const iv = crypto.randomBytes(16); //초기화 벡터. 더 강력한 암호화를 위해 사용. 랜덤값이 좋음
const key = crypto.scryptSync('myprojectsSpecialKey', 'movieTheaterSalt', 32); // 나만의 암호화키. password, salt, byte 순인데 password와 salt는 본인이 원하는 문구로~

/**
 * @description 양방향 암호화 함수
 *
 * @param {String} data 암호화 데이터
 */
export const Encryption = async (data: string) => {
  if (data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    return encryptedData;
  } else {
    return '';
  }
};

/**
 * @description 복화화 함수
 *
 * @param {String} data 복호화 데이터
 */
export const Decryption = async (data: string): Promise<string> => {
  if (data) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(data, 'base64', 'utf8');
    decryptedData += decipher.final('utf-8');

    return decryptedData;
  } else {
    return null;
  }
};

export const ImageUplpad = async (file: Express.Multer.File, bucket: any) => {
  const fileBuffer = fs.readFileSync(file.path);
  let blob = bucket.file(file.filename);
  blob.name = 'movies/' + blob.name;
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    console.log(err);
  });

  blobStream.on('finish', () => {
    console.log('finish');
  });

  blobStream.end(fileBuffer);
};

/**
 * @description Error 처리 모듈
 *
 * @param httpStatus HttpStatus 상태 값
 * @param error Error 메시지
 * @param data 클라이언트에게 반환되는 데이터
 */
export const ErrorException = (
  httpStatus: HttpStatus,
  error: string,
  data: number,
) => {
  throw new HttpException(
    {
      data,
      error,
      timestamp: dayjs().tz().format('YYYY-MM-DD HH:mm:ss'),
    },
    httpStatus,
  );
};
