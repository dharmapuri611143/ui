import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPoint } from './server.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as SocketIo from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() addCartCount: EventEmitter<any> = new EventEmitter<any>();
  @Output() loginModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyEvent: EventEmitter<any> = new EventEmitter<any>();
  letters = '0123456789ABCDEF';
  user: any;
  mime = {
    aac: 'audio/aac',
    abw: 'application/x-abiword',
    arc: 'application/x-freearc',
    avi: 'video/x-msvideo',
    azw: 'application/vnd.amazon.ebook',
    bin: 'application/octet-stream',
    bmp: 'image/bmp',
    bz: 'application/x-bzip',
    bz2: 'application/x-bzip2',
    csh: 'application/x-csh',
    css: 'text/css',
    csv: 'text/csv',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    eot: 'application/vnd.ms-fontobject',
    epub: 'application/epub+zip',
    gif: 'image/gif',
    htm: 'text/html',
    html: 'text/html',
    ico: 'image/vnd.microsoft.icon',
    ics: 'text/calendar',
    jar: 'application/java-archive',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'text/javascript',
    json: 'application/json',
    mid: 'audio/midi audio/x-midi',
    midi: 'audio/midi audio/x-midi',
    mjs: 'application/javascript',
    mp3: 'audio/mpeg',
    mpeg: 'video/mpeg',
    mpkg: 'application/vnd.apple.installer+xml',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    oga: 'audio/ogg',
    ogv: 'video/ogg',
    ogx: 'application/ogg',
    otf: 'font/otf',
    png: 'image/png',
    pdf: 'application/pdf',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    rar: 'application/x-rar-compressed',
    rtf: 'application/rtf',
    sh: 'application/x-sh',
    svg: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    tar: 'application/x-tar',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    ttf: 'font/ttf',
    txt: 'text/plain',
    vsd: 'application/vnd.visio',
    wav: 'audio/wav',
    weba: 'audio/webm',
    webm: 'video/webm',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    xhtml: 'application/xhtml+xml',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xml: 'application/xml ',
    xul: 'application/vnd.mozilla.xul+xml',
    zip: 'application/zip',
    '7z': 'application/x-7z-compressed'
  };
  public socket = SocketIo(EndPoint('socket'), {upgrade: false, transports: ['websocket'] });
  constructor(private http: HttpClient,
    private router: Router) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  // courses apis
  getImageByPath(body){ return this.http.post<any>(EndPoint() + 'admin/imagebypath/', body);}
  getRootCategories() { return this.http.get<any>(EndPoint() + 'rootcategory/'); }
  getCategories(data) { return this.http.get<any>(EndPoint() + 'category/' + data); }
  getCategoryByOne(body: any) { return this.http.post<any>(EndPoint() + 'category/one/', body); }
  // services for subject
  getSubjects(data) { return this.http.get<any>(EndPoint() + 'subject/' + data); }
  getSubjectsByOne(body: any) { return this.http.post<any>(EndPoint() + 'subject/one', body); }
  getAllCourses() { return this.http.get<any>(EndPoint() + 'category/'); }
  getCourses(query: any) { return this.http.post<any>(EndPoint() + 'courses/', query); }
  getCourseByOne(body: any) { return this.http.post<any>(EndPoint() + 'courses/one', body); }
  getCourseById(id: any) { return this.http.get<any>(EndPoint() + 'courses/' + id); }
  getDemoVideo(id: string) { return this.http.get<any>(EndPoint() + 'content/demourl/' + id); }
  getCourseFilter(query: any) { return this.http.post<any>(EndPoint() + 'courses/filter', query); }
  getLatestCourse(query: any) { return this.http.get<any>(EndPoint() + 'courses/type/' + query); }
  getHomeCourses() { return this.http.get<any>(EndPoint() + 'courses/homelist/'); }
  getCartList() { return this.http.post<any>(EndPoint() + 'cart/one', { userId: JSON.parse(localStorage.getItem('user'))._id }); }
  getCartCount() { return this.http.post<any>(EndPoint() + 'cart/cartcount', { userId: JSON.parse(localStorage.getItem('user'))._id }); }
  deleteFromCartList(courseId: any) { return this.http.post<any>(EndPoint() + 'cart/delete', { courses: courseId, userId: JSON.parse(localStorage.getItem('user'))._id }); }
  deleteList() { return this.http.delete<any>(EndPoint() + 'cart/deleteall/' + JSON.parse(localStorage.getItem('user'))._id); }
  getSubjectList() { return this.http.get<any>(EndPoint() + 'subject/'); }
  getShortReport() { return this.http.get<any>(EndPoint() + 'report/home/'); }
  getCategory() { return this.http.get<any>(EndPoint() + 'category/'); }
  getCurrCourse(body) { return this.http.post<any>(EndPoint() + 'courses/currcourse', body); }

  freeMatFetch(body) { return this.http.post<any>(EndPoint() + 'courses/freemat/fetch', body); }
  freeMatById(body) { return this.http.post<any>(EndPoint() + 'courses/freemat/byId', body); }
  freeMatSave(body) { return this.http.post<any>(EndPoint() + 'courses/freemat/save', body); }
  freeMatImgUp(body) { return this.http.post<any>(EndPoint() + 'courses/freemat/upimg', body); }
  freeMatDelete(body: any) { return this.http.post<any>(EndPoint() + 'courses/freemat/delete/', body); }
  
  // students apis
  update(model: any) { return this.http.put(EndPoint() + 'users/' + model._id, model); }
  updatePassword(query: any) { return this.http.post<any>(EndPoint() + 'users/password/', query); }
  uploadProfileImage(query: any) { return this.http.post<any>(EndPoint() + 'users/profile/image/', query); }
  getStudentReport() { return this.http.post<any>(EndPoint() + 'stdreport/one', { purchasedBy: JSON.parse(localStorage.getItem('user'))._id }); }
  saveResult(query: any) { return this.http.post<any>(EndPoint() + 'assessment/answer/', query); }
  getAssessment(query: any) { return this.http.post<any>(EndPoint() + 'assessment/getassessment/', query); }
  fetchResult(query: any) { return this.http.post<any>(EndPoint() + 'assessment/result/', query); }
  fetchAssessmentByUser(query: any) { return this.http.post<any>(EndPoint() + 'assessment/userid/', query); }
  complete(body: any) { return this.http.post<any>(EndPoint() + 'assessment/complete/assessment/', body); }
  assPublish(body: any) { return this.http.post<any>(EndPoint() + 'assessment/publish/', body); }
  
  // end students apis

  // orders apis
  fetchOrders(body: any) { return this.http.post<any>(EndPoint() + 'order/', body); }
  orderPlaced(body: any) { return this.http.post<any>(EndPoint() + 'order/placed', body); }
  getOrderList() { return this.http.post<any>(EndPoint() + 'order/one', { purchasedBy: JSON.parse(localStorage.getItem('user'))._id }); }
  getPurchasedCourse(body) { return this.http.post<any>(EndPoint() + 'order/course', body); }
  getVideoContent(id) { return this.http.get<any>(EndPoint() + 'content/' + id); }
  getRelatedCourse(courseId) { return this.http.get<any>(EndPoint() + 'order/relatedcourse/' + courseId); }
  getOrderDetail(txnid) { return this.http.get<any>(EndPoint() + 'order/txnid/' + txnid); }
  addToCarts(id) {
    return this.http.post(EndPoint() + 'cart/', {courses: id, userId: JSON.parse(localStorage.getItem('user'))._id});
   }
  orderManually(body: any) { return this.http.post<any>(EndPoint() + 'payment/ordermanually', body); }
  
  makePayment() {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.http.post<any>(EndPoint() + 'payment/payu', {
      userId: user._id, firstName: user.firstName,
      lastName: user.lastName, email: user.email, phone: user.phone
    });
  }
  // end orders

  // review
  createReview(body) {
    body.reviwedBy = JSON.parse(localStorage.getItem('user'))._id;
    return this.http.post<any>(EndPoint() + 'order/review', body);
  }
  myNoti(data: any) { return this.http.post<any>(EndPoint() + 'users/mynoti', data); }
  myNotiC(data: any) { return this.http.post<any>(EndPoint() + 'users/mynotic', data); }
  readNoti(data: any) { return this.http.post<any>(EndPoint() + 'users/readnoti', data); }
  getReview(query) { return this.http.get<any>(EndPoint() + 'order/reviews/' + query); }
  fetchAllReview(data){ return this.http.post<any>(EndPoint() + 'order/reviews/all', data); }
  removeReview(id: any) { return this.http.delete<any>(EndPoint() + 'order/reviews/' + id); }

  submitContact(data: any) { return this.http.post<any>(EndPoint() + 'users/contactus', data); }
  fetchInquiry(data: any) { return this.http.post<any>(EndPoint() + 'users/finquiry', data); }
  updateInquiry(data: any) { return this.http.post<any>(EndPoint() + 'users/uinquiry', data); }

  // payment
  refundPay(data: any){return this.http.post<any>(EndPoint() + 'payment/refundpay', data);}
  // end review

  // open pdf file
  downloadPDF(url): any {
    return this.http.get(url, { responseType: 'blob' as 'json' })
      .map((res: any) => {
        return new Blob([res], { type: 'application/pdf', });
      });
  }
  // end pdf file

  // faq
  createFaq(body) {
    body.faqBy = JSON.parse(localStorage.getItem('user'))._id;
    return this.http.post<any>(EndPoint() + 'faq/', body);
  }

  getFaq(body) { return this.http.post<any>(EndPoint() + 'faq/one', body); }
  // end faq
  // start Admin =============================

  getStudents(params) { return this.http.get<any[]>(EndPoint() + 'users/', { params: params }); }
  saveStudents(data) { return this.http.post<any[]>(EndPoint() + 'users/save/details/', data); }  
  stdAutoComp(data) { return this.http.post<any[]>(EndPoint() + 'users/uautocom/', data); }
  
  asmtList(data) { return this.http.post<any>(EndPoint() + 'assessment/list/', data); }
  getAssessements(data: any) {
    if (JSON.parse(localStorage.getItem('user')).role === 'admin') {
      return this.http.get<any>(EndPoint() + 'assessment/');
    } else {
      return this.http.get<any>(EndPoint() + 'assessment/user/id/' + data._id);
    }
  }
  addAssessmentToStudents(data) { return this.http.post<any[]>(EndPoint() + 'assessment/add/assessment/', data); }
  getAsmt(data) { return this.http.post<any[]>(EndPoint() + 'assessment/fetchList', data); }
  getContent(query) { return this.http.get<any>(EndPoint() + 'content/' + query); }
  saveCourse(data: any) { return this.http.post<any>(EndPoint() + 'courses/save/course/', data); }
  removeCourse(query: any) { return this.http.post<any>(EndPoint() + 'courses/remove/', query); }
  uploadCoursedata(data: any) { return this.http.post<any>(EndPoint() + 'content/', data); }
  uploadCourseCont(data: any) { return this.http.post<any>(EndPoint() + 'content/savecont/', data); }
  uploadCourseVideo(data: any) { return this.http.post<any>(EndPoint() + 'content/upload', data); }
  dvideo(data: any) { return this.http.post<any>(EndPoint() + 'content/vd', data); }
  dvideoc(data: any) { return this.http.post<any>(EndPoint() + 'content/vdc', data); }
  uploadCourseImage(data: any) { return this.http.post<any>(EndPoint() + 'courses/upload/image', data); }
  uploadCourseDocs(data: any) { return this.http.post<any>(EndPoint() + 'courses/upload/docs', data); }
  getCategoryDetails() { return this.http.get<any>(EndPoint() + 'category/routes/childcategories/'); }
  saveCategoryDetails(data) { return this.http.post<any>(EndPoint() + 'category/save/details/', data); }
  removeSubject(data: any) { return this.http.delete<any>(EndPoint() + 'subject/' + data); }
  removeCategory(data: any) { return this.http.delete<any>(EndPoint() + 'category/' + data); }
  removeRootCategory(data: any) { return this.http.delete<any>(EndPoint() + 'rootcategory/' + data); }
  uploadCategoryImage(data: any) { return this.http.post<any>(EndPoint() + 'category/upload/image', data); }
  saveAssessmentDetails(data: any) { return this.http.post<any>(EndPoint() + 'assessment/save/', data); }
  removeAssessment(data: any) { return this.http.delete<any>(EndPoint() + 'assessment/' + data); }
  removeQuestion(data: any) { return this.http.delete<any>(EndPoint() + 'assessment/question/' + data); }
  saveQuestionDetails(data: any) { return this.http.post<any>(EndPoint() + 'assessment/save/questions', data); }
  getQuestionByAssessment(data: any) { return this.http.get<any>(EndPoint() + 'assessment/get/questions/' + data); }
  getQuestionById(data: any) { return this.http.get<any>(EndPoint() + 'assessment/question/' + data); }
  studentDash(data: any) { return this.http.post<any>(EndPoint() + 'admin/studentd/', data); }
  adminDash(data: any) { return this.http.post<any>(EndPoint() + 'admin/admind/', data); }
  countsDash(data: any) { return this.http.post<any>(EndPoint() + 'admin/countsd/', data); }
  
  // end Admin ===========================

  // start add blog =============================
  blogFetch(body: any) { return this.http.post<any>(EndPoint() + 'blog/', body); }
  blogDelete(body: any) { return this.http.post<any>(EndPoint() + 'blog/delete/', body); }
  blogAdd(body: any) { return this.http.post<any>(EndPoint() + 'blog/addblog/', body); }
  blogGetById(id: string) { return this.http.get<any>(EndPoint() + 'blog/' + id); }
  blogUpImage(body: any) { return this.http.post<any>(EndPoint() + 'blog/ubimage/', body); }
  createbReview(body) {
    body.reviwedBy = JSON.parse(localStorage.getItem('user'))._id;
    return this.http.post<any>(EndPoint() + 'blog/review', body);
  }
  getbReview(query) { return this.http.get<any>(EndPoint() + 'blog/reviews/' + query); }
  fetchAllbReview(data){ return this.http.post<any>(EndPoint() + 'blog/reviews/all', data); }
  removebReview(id: any) { return this.http.delete<any>(EndPoint() + 'blog/reviews/' + id); }
  blogCatSave(data){ return this.http.post<any>(EndPoint() + 'blog/blogcat/add', data); }
  blogRootCatSave(data){ return this.http.post<any>(EndPoint() + 'blog/blogrootcat/add', data); }
  blogCatDelete(id) { return this.http.delete<any>(EndPoint() + 'blog/blogcat/delete/' + id); }
  blogRootCatDelete(id) { return this.http.delete<any>(EndPoint() + 'blog/blogrootcat/delete/' + id); }
  blogCatFetch(data){ return this.http.get<any>(EndPoint() + 'blog/blogcat/all', {params: data} ); }
  blogRootCatFetch(data){ return this.http.get<any>(EndPoint() + 'blog/blogrootcat/all' , {params: data}); }
  blogCatRootFetch({}){ return this.http.get<any>(EndPoint() + 'blog/blogcat/catroot'); }

  // end add blog =============================
  // start jobs api ============================
  jobsFetch(body: any) { return this.http.post<any>(EndPoint() + 'jobs/', body); }
  jobsApplyFetch(body: any) { return this.http.post<any>(EndPoint() + 'jobs/fetchapply/', body); }
  jobDelete(body: any) { return this.http.post<any>(EndPoint() + 'jobs/delete/', body); }
  jobsAdd(body: any) { return this.http.post<any>(EndPoint() + 'jobs/addjobs/', body); }
  jobGetById(id: string) { return this.http.get<any>(EndPoint() + 'jobs/' + id); }
  jobsUploadResume(body: any) { return this.http.post<any>(EndPoint() + 'jobs/upresume/', body); }
  jobApply(body: any) { return this.http.post<any>(EndPoint() + 'jobs/apply/', body); }
  jobApplyDelete(body: any) { return this.http.post<any>(EndPoint() + 'jobs/delapplyjob/', body); }
  jobApplyUpdate(body: any) { return this.http.post<any>(EndPoint() + 'jobs/updateapplyjob/', body); }
  
  jobConfigAdd(body: any) { return this.http.post<any>(EndPoint() + 'jobs/jobconfig/', body); }
  JobConfigRevmove(body: any) { return this.http.post<any>(EndPoint() + 'jobs/jcondel/', body); }
  jobConfigFetch(body: any){ return this.http.post<any>(EndPoint() + 'jobs/fechjobconf/', body); }
  
  // end jobs api ==============================
  // start home page =============================
  homeSlider() { return this.http.post<any>(EndPoint() + 'admin/homesliderdn/', {}); }
  homeSliderD(data) { return this.http.post<any>(EndPoint() + 'admin/homesd/', data); }
  
  uploadHtml(formData) {return this.http.post<any>(EndPoint() + 'admin/uploadhtml', formData)};
  uploadHomeSlider(formData) {return this.http.post<any>(EndPoint() + 'admin/homesliderup?folderPath=home/slider&type=homeslider', formData)}
  headerSearch(body: any) { return this.http.post<any>(EndPoint() + 'service/headsearch/', body); }
  homeServices(body: any) { return this.http.post<any>(EndPoint() + 'service/homeservice/', body); }
  downloadFile(body: any) { return this.http.post<any>(EndPoint() + 'admin/dfile/', body); }
  removeFile(body: any) { return this.http.post<any>(EndPoint() + 'admin/deletefile/', body); }
  
  
  
  saveData(data, fileName) {
    let a: any;
    const fileExt = fileName.split('.').pop();
    const ftype = this.mime[fileExt];
    a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    const blob = new Blob([new Uint8Array(data.data)], { type: ftype });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
  }
  // end home page =============================
  // end dashboard =============================
}