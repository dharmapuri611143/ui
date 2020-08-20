import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import { EndPoint } from 'app/shared/services/server.service';

@Injectable()
export class ChatService {
  public contacts: any;
  public chats: any;
  public user: any;
  public collectionLoading: boolean;
  onContactSelected = new BehaviorSubject<any>(null);
  onUserUpdated = new Subject<any>();

  onChatSelected = new BehaviorSubject<any>(null);
  onChatsUpdated = new Subject<any>();

  public baseURL = 'https://api.api.ai/v1/query?v=20150910';

  constructor(private http: HttpClient) {
    // console.log('from service');
    // this.loadChatData()
  }

  loadChatData(): Observable<any> {
    return combineLatest(
      this.getAllContacts({}),
      // this.getAllChats(),
      // this.getCurrentUser(),
      (contacts) => {
        this.contacts = contacts;
        // this.chats = chats;
        // this.user = user;
        // this.onUserUpdated.next(user);
      }
    );
    // return combineLatest(
    //   this.getAllContacts({}),
    //   this.getAllChats(),
    //   this.getCurrentUser(),
    //   (contacts, chats, user) => {
    //     this.contacts = contacts;
    //     this.chats = chats;
    //     this.user = user;
    //     this.onUserUpdated.next(user);
    //   }
    // );
  }
  public getChatByContact(chatId): Observable<any> {
    this.collectionLoading = true;
    return this.getAllChats({ chatId: chatId })
      .switchMap(chats => {
        let chatCollection = chats;
        let contact = this.contacts.find(
          contact => contact.chatId === chatId
        );
        (contact || {}).createdBy.chatId = chatId;
        this.onChatSelected.next({
          chatCollection: chatCollection,
          contact: (contact || {}).createdBy
        });
        this.collectionLoading = false;
        return of(chatCollection);
      });
  }

  saveAmidaBotMessage(body): any {
    return this.http.post<any>(EndPoint() + 'chatbot/savemessages/', body);
  }
  sendAmidaBotMessage(body): any {
    //let token = 'c2554e8fb2e640348f1065e7e6972f7d'; // use your token from dialog flow
    let token = '8f1870f94a8f4ba88410f941c6773963'; // use your token from dialog flow
    const data = {
      query: body.text,
      lang: 'en',
      sessionId: body.chatId
    };
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    console.log("headers", headers);
    return this.http.post<any>(this.baseURL, data, { headers: headers });
  }
  sendAmiBotMessage(body): any {
    //let token = '7dadd46872ff498a98d59883d8db1ad3'; // use your token from dialog flow
    let token = '7f811f17d53f4b84bb8d678528b7ff46'; // use your token from dialog flow
    const data = {
      query: body.text,
      lang: 'en',
      sessionId: body.chatId
    };
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    console.log("headers", headers);
    return this.http.post<any>(this.baseURL, data, { headers: headers });
  }
  getAllContacts(body): any {
    return this.http.post<any>(EndPoint() + 'chat/chatusers/', body);
  }
  getAllChats(body): any {
    return this.http.get<any>(EndPoint() + 'chatbot/getchats/' + body);
  }
  // getAllChats(body): any {
  //   return this.http.post<any>(EndPoint() + 'chat/chatbyuser/', body);
  // }
  getCurrentUser(body): any {
    return this.http.post<any>(EndPoint() + 'chat/chatcurruser/', body);
  }
  updateUser(user): any {

  }
  // chat =======================================
  getChatUsers(body: any) { return this.http.post<any>(EndPoint() + 'chat/chatusers/', body); }
  // end chat =======================================
  updateChats(chatId: string, chats: any): Observable<any> {
    const chatCollection: any = {
      id: chatId,
      chats: chats
    }
    return this.http.put<any>('api/chat-collections', chatCollection)
  }

  autoReply(chat) {
    setTimeout(() => {
      this.onChatsUpdated.next(chat);
    }, 1500);
  }
}
