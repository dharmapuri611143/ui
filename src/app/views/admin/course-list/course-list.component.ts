import { GapiSession } from "./../../../services/gapi.session";
import { FileRepository } from "./../../../services/file.repository";
import { FileInfo } from "./../../../services/fileInfo";

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { UserService } from "../../../shared/services/user.service";
import { AppConfirmService } from "../../../shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService } from "../../../shared/services/api.service";
import { Subscription } from "rxjs/Subscription";
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EndPoint } from "../../../shared/services/server.service";
import Swal from "sweetalert2";
import { DOCUMENT } from "@angular/common";
@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
  styleUrls: ["./course-list.component.scss"],
  animations: egretAnimations,
})
export class CourseListComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public courseForm: FormGroup;
  public vForm: FormGroup;
  currentFile: FileInfo;
  files: FileInfo[] = [];
  currentIndex: number = -1;
  parentIdVideo = "";
  socket: any;
  items = {
    limit: 15,
    skip: 1,
    count: 0,
    offset: 0,
    docs: [],
    page: 1,
    pages: 0,
    total: 0,
  };
  apiPath = EndPoint() + "video/?filename=";
  selectedVideo = "";
  paginatlimit = [5, 10, 25];
  rootCategories: any = [];
  categories: any = [];
  subjects: any = [];
  hclflag = false;
  rootCategory: any;
  category: any;
  subject: any;
  courseData: any;
  contentData: any;
  vprocess = 0;
  indexArray = 0;
  videoList = [this.indexArray];
  vList = [];
  suHFiles = [];
  responseURL ="";
  // for file upload..
  fileReader = new FileReader();
  public selectedFile: File;
  public contentDataFlag = false;
  public selectedImage = [];
  public selectedDocs = [];
  public subs1: Subscription;
  public subs2: Subscription;
  public subs3: Subscription;
  public subs4: Subscription;
  public subs5: Subscription;
  public subs6: Subscription;
  public subs7: Subscription;
  public subs8: Subscription;
  public subs9: Subscription;
  public subs10: Subscription;
  private clientUrl = "";
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private api: ApiService,
    private elRef: ElementRef,
    public sanitizer: DomSanitizer,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public userService: UserService,
    private cdf: ChangeDetectorRef,
    public fileRepository: FileRepository,
    public gapiSession: GapiSession
  ) {
    this.clientUrl =
      document.location.protocol + "//" + document.location.hostname + ":8080/";
    this.gapiSession.initClient().then((res) => {});
  }

  connectGoogleDrive() {
    console.log("conn");

    this.gapiSession.signIn().then(() => {
      this.fileRepository.getFiles("root").then((res1) => {
        for (let item of res1) {
          if (item.Name === "amida_files") {
            this.fileRepository.getFiles(item.Id).then((response) => {
              for (let item of response) {
                if (item.Name === "videos") {
                  this.parentIdVideo = item.Id;
                }
              }
            });
          }
        }
      });
    });
  }
  ngOnInit() {
    this.socket = this.api.socket;
    // this.socket.on("upload:moredata", (data) => {
    //   setTimeout(() => {
    //     this.moreData(data);
    //   }, 10);
    // });
    // this.socket.on("upload:done", (data) => {
    //   if (data.error) {
    //     this.loader.close();
    //     this.confirmMsg("Fail", data.error);
    //   } else {
    //     this.loader.close();
    //     this.confirmMsg("Success", "Video details successfully updated !!");
    //     // this.getCourseById();
    //     this.vForm.reset();
    //     this.getContent();
    //     this.onClickCourse(this.courseData);
    //   }
    // });
    // this.socket.on('disconnect', function (data) {
    //   console.log('client disconnected');
    // });

    this.filterForm = this.fb.group({
      filterQuery: [""],
    });
    this.vForm = this.fb.group({
      title: ["", Validators.required],
      contentTitle: ["", Validators.required],
      contentId: [""],
      seq: ["", Validators.required],
      vseq: ["", Validators.required],
      _id: [""],
      duration: [""],
      existPath: [""],
      vFlag: [""],
    });
    this.bcForm();
    this.getCourseList();
  }

  bcForm() {
    this.courseForm = this.fb.group({
      name: [(this.courseData || {}).name || "", Validators.required],
      headline: [(this.courseData || {}).headline || "", Validators.required],
      rootCategoryName: [
        (this.courseData || {}).rootCategoryName || "",
        Validators.required,
      ],
      categoryName: [
        (this.courseData || {}).categoryName || "",
        Validators.required,
      ],
      subjectName: [
        (this.courseData || {}).subjectName || "",
        Validators.required,
      ],
      keywords: [(this.courseData || {}).keywords || "", Validators.required],
      level: [(this.courseData || {}).level || "", Validators.required],
      subjectCode: [
        (this.courseData || {}).subjectCode || "",
        Validators.required,
      ],
      price: [(this.courseData || {}).price || "", Validators.required],
      totalDuration: [
        (this.courseData || {}).totalDuration || "",
        Validators.required,
      ],
      description: [
        (this.courseData || {}).description || "",
        Validators.required,
      ],
      about: [(this.courseData || {}).about || "", Validators.required],
      coursePrerequisites: [
        (this.courseData || {}).coursePrerequisites || "",
        Validators.required,
      ],
      benefits: [(this.courseData || {}).benefits || "", Validators.required],
      htmlFlag: [
        (this.courseData || {}).htmlFlag || false,
        Validators.required,
      ],
    });
    if (this.courseForm.value.rootCategoryName) {
      this.showCategories(this.courseForm.value.rootCategoryName);
    }
    if (this.courseForm.value.categoryName) {
      setTimeout(() => {
        this.onCategoryChange(this.courseForm.value.categoryName);
      }, 100);
    }
    if (this.courseForm.value.subjectName) {
      setTimeout(() => {
        this.onSubjectChange(this.courseForm.value.subjectName);
      }, 300);
    }
    if ((this.courseData || {})._id) {
      this.getContent();
    }
    this.getCategory();
  }
  ngOnDestroy() {
    this.gapiSession.signOut();
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
    if (this.subs7) {
      this.subs7.unsubscribe();
    }
    if (this.subs8) {
      this.subs8.unsubscribe();
    }
    if (this.subs9) {
      this.subs9.unsubscribe();
    }
    if (this.subs10) {
      this.subs10.unsubscribe();
    }
  }
  searchSubmit() {
    this.getCourseList();
  }
  onClickCourse(course) {
    this.courseData = course;
    this.cdf.detectChanges();
    this.bcForm();
  }
  resetForm() {
    this.courseData = {};
    this.contentData = [];
    this.bcForm();
  }
  getCourseList() {
    this.loader.open();
    this.subs1 = this.api
      .getCourses({
        skip: this.items.skip,
        limit: this.items.limit,
        filterQuery: this.filterForm.value.filterQuery,
      })
      .subscribe(
        (res) => {
          this.loader.close();
          let dataArray = [];
          for (let item of res.docs) {
            if ((item || {}).image) {
              let path = item.image;
              path = path.substr(16);
              item.image = this.clientUrl + path;
            }
            if ((item || {}).htmlcontent) {
              item.htmlcontent = this.clientUrl + item.htmlcontent;
            }
            dataArray.push(item);
          }
          this.items.docs = dataArray;
          this.items.limit = res.limit;
          this.items.page = res.page;
          this.items.pages = res.pages;
          this.items.total = res.total;
          this.items.offset = res.page - 1;
          this.cdf.detectChanges();
        },
        (err) => {
          this.loader.close();
          this.confirmMsg("Fail", err.error);
        }
      );
  }
  getCourseById() {
    this.subs2 = this.api.getCourseById(this.courseData._id).subscribe(
      (res) => {
        this.courseData = res;
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  getContent() {
    this.subs3 = this.api.getContent(this.courseData._id).subscribe(
      (result) => {
        this.contentData = result;
        if (this.contentData.length > 0) {
          this.contentDataFlag = true;
        }
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  getCategory() {
    this.subs4 = this.api.getCategoryDetails().subscribe(
      (result) => {
        this.rootCategories = result;
        this.cdf.detectChanges();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  showCategories(rootcname) {
    for (const i in this.rootCategories) {
      if (rootcname && this.rootCategories[i].name === rootcname) {
        this.subjects = [];
        this.categories = this.rootCategories[i].categories;
        this.rootCategory = this.rootCategories[i];
      } else if (this.rootCategories[i].name === rootcname) {
        this.categories = this.rootCategories[i].categories;
        this.rootCategory = this.rootCategories[i];
      }
    }
    this.cdf.detectChanges();
  }

  setPage(pageInfo) {
    this.items.limit = pageInfo.pageSize;
    this.items.skip = pageInfo.pageIndex + 1;
    this.getCourseList();
  }

  onCategoryChange(cname) {
    for (const i in this.categories) {
      if (this.categories[i].name === cname) {
        this.subjects = this.categories[i].subjects;
        this.category = this.categories[i];
      }
    }
    this.cdf.detectChanges();
  }
  showHideHtml(flag) {
    this.hclflag = flag;
  }
  onSubjectChange(event) {
    this.subjects.forEach((cat) => {
      if (cat.name === event) {
        this.subject = cat;
      }
    });
    this.cdf.detectChanges();
  }

  removeCourse(data) {
    this.subs5 = this.api.removeCourse(data).subscribe(
      (result) => {
        this.confirmMsg("Success", "Course removed succesfully");
        this.getCourseList();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  onHtmlChange(event) {
    this.suHFiles = event.target.files;
  }
  uploadHtmlFile() {
    if (this.suHFiles.length === 0) {
      Swal.fire({
        type: "warning",
        title: "Validation",
        text: "Please select file",
      });
      return;
    } else {
      this.loader.open();
      const formData = new FormData();
      for (const file of this.suHFiles) {
        formData.append("files", file);
      }
      this.subs10 = this.api.uploadHtml(formData).subscribe(
        (res) => {
          this.courseForm.value.htmlcontent = res.linkpoint;
          this.courseForm.value.htmlpath = res.htmlpath;
          this.courseForm.value.ishtmlc = true;
          this.onSaveCourse();
          this.loader.close();
          this.cdf.detectChanges();
          this.confirmMsg("Success", "Content successfully uploaded");
        },
        (err) => {
          this.loader.open();
          this.confirmMsg("Fail", err.error);
        }
      );
    }
  }
  onSaveCourse() {
    console.log("this.rootCategory", this.rootCategory);
    if (!(this.courseData || {})._id && this.selectedImage.length === 0) {
      this.confirmMsg("Validation", "Please upload Image and Submit");
      return;
    }
    if ((this.subject || {})._id) {
      this.courseForm.value.subject = this.subject._id;
    }
    if ((this.category || {})._id) {
      this.courseForm.value.category = this.category._id;
    }
    if ((this.rootCategory || {}).id) {
      this.courseForm.value.rootCategory = this.rootCategory.id;
    }

    if ((this.courseData || {})._id) {
      this.courseForm.value._id = this.courseData._id;
    }
    this.subs6 = this.api.saveCourse(this.courseForm.value).subscribe(
      (res) => {
        this.courseData = res;
        if (this.selectedImage.length > 0) {
          this.onuploadCourseImage();
        } else {
          this.getCourseList();
        }
        this.cdf.detectChanges();
        this.confirmMsg("Success", "Succesfully saved course details");
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }
  onImageChange(event) {
    this.selectedImage = event.target.files;
  }
  onuploadCourseImage() {
    const formData = new FormData();
    formData.append("courseId", (this.courseData || {})._id);
    formData.append(
      "imageFile",
      this.selectedImage[0],
      this.selectedImage[0].name
    );
    this.subs7 = this.api.uploadCourseImage(formData).subscribe(
      (result) => {
        this.confirmMsg("Success", "Image has been uploaded successfully");
        this.getCourseList();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  onDocChange(event) {
    this.selectedDocs = event.target.files;
  }

  uploadDocs() {
    const formData = new FormData();
    for (let doc of this.selectedDocs) {
      formData.append("_id", (this.courseData || {})._id);
      formData.append("docs/" + this.courseData.subjectName, doc, doc.name);
      formData.append("folderPath", "docs/" + this.courseData.subjectName);
    }

    this.subs7 = this.api.uploadCourseDocs(formData).subscribe(
      (result) => {
        this.confirmMsg("Success", "Docs has been uploaded successfully");
        this.getCourseList();
      },
      (err) => {
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  dRemove(dname) {
    this.subs8 = this.api
      .removeFile({ _id: this.courseData._id, path: dname })
      .subscribe(
        (res) => {
          this.courseData.docs = res.docs;
          this.cdf.detectChanges();
          this.confirmMsg("Success", "Docs has been deleted successfully");
        },
        (err) => {
          this.confirmMsg("Fail", err.error);
        }
      );
  }
  dDocs(dname) {
    if (!(this.courseData || {})._id) {
      this.confirmMsg("Fail", "Please select the course");
      return;
    }
    this.loader.open();
    this.subs8 = this.api
      .downloadFile({ _id: this.courseData._id, path: dname })
      .subscribe(
        (res) => {
          let splitFname = dname.split("/");
          let aLen = splitFname.length;
          splitFname = splitFname[aLen - 1];
          this.api.saveData(res.base64Data, splitFname);
          this.loader.close();
        },
        (err) => {
          this.loader.close();
          this.confirmMsg("Fail", err.error);
        }
      );
  }
  nextFile() {
    this.currentIndex++;
    if (this.currentIndex <= this.files.length - 1) {
      return this.files[this.currentIndex];
    }
  }

  addVideo() {
    this.indexArray++;
    this.videoList.push(this.indexArray);
  }

  onEditVidio(value) {}
  removeArray(index) {
    const valIndex = this.vList.indexOf("path" + index);
    this.vList.splice(valIndex, 1);
    this.videoList.splice(index, 1);
  }
  addVideoOnexistingContent(content) {
    console.log("con", content);
    // this.currentFile.Progress = 10;
    this.vForm.controls["title"].setValue(content.title);
    this.vForm.controls["seq"].setValue(content.seq);
    this.vForm.controls["contentId"].setValue(content._id);
  }
  showVideo(video) {
    this.selectedVideo = video.path;

    // let getVideo = document.getElementById("sub-video") as HTMLMediaElement;
    // let getSource = document.getElementById("source");

    //     getSource.setAttribute("src", this.selectedVideo);
    //     getVideo.load()
    // getVideo .play();

    // videop.load();
    // videop.play();
    // this.cdf.detectChanges();
    //  let element = document.getElementsByClassName('ndfHFb-c4YZDc-Wrql6b')[0] as HTMLElement;
    //  console.log('element', element);
    //  element.style.display = 'none';

    // const player = this.elRef.nativeElement.querySelector("#sub-video");
    // player.load();
    // player.play();
  }
  editVideo(video, content) {
    console.log("video", video);
    this.vForm.setValue({
      existPath: video.path,
      title: content.title,
      seq: content.seq,
      contentTitle: video.title,
      vseq: video.vseq,
      contentId: content._id,
      _id: video._id,
      vFlag: (video || {}).vFlag || "",
      duration: video.duration || 0,
    });
    this.selectedVideo = "";
  }
  vFormReset() {
    this.vForm.reset();
  }
  run() {}
  deleteVideo(vId, path, id) {
    this.loader.open();
    this.fileRepository
      .delete(path)
      .then((res) => {
        console.log("deleted from drive");
      })
      .catch((err) => {
        this.confirmMsg("Fail", err);
      });

    this.subs8 = this.api.dvideo({ _id: id, vId: vId }).subscribe(
      (res) => {
        this.getContent();
        this.vForm.reset();
        this.loader.close();
        this.cdf.detectChanges();
        this.confirmMsg("Success", "Succesfully deleted!!");
      },
      (err) => {
        this.loader.close();
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  async deleteFilesDrive(id) {
    let content: any;
    for (let item of this.contentData) {
      if (id === item._id) {
        content = item;
      }
    }
    for (let item of content.videoUrl) {
      await this.fileRepository.delete(item.path);
    }
    this.deleteContent(id);
  }
  deleteContent(id) {
    this.loader.open();
    this.subs9 = this.api.dvideoc({ _id: id }).subscribe(
      (res) => {
        this.getContent();
        this.loader.close();
        this.cdf.detectChanges();
        this.confirmMsg("Success", "Successfully deleted!!");
      },
      (err) => {
        this.loader.close();
        this.confirmMsg("Fail", err.error);
      }
    );
  }

  onFileChange(event) {
    let fileInfo = new FileInfo();
    fileInfo["Blob"] = event.target.files[0];
    fileInfo["Name"] = event.target.files[0].name;
    this.selectedFile = event.target.files[0];;
    console.log("event", this.selectedFile);
  }




  onAddVideoDetails() {
    var formData = new FormData();
    formData.append('file', this.selectedFile);
    console.log(this.selectedFile)
      const  url= "https://a0mh70txwa.execute-api.ap-south-1.amazonaws.com/dev";
      fetch(
        url, {
        method: 'POST',
        mode: 'cors',
        body:  JSON.stringify({ key: "demo-file"}),
        headers: {
          'content-type': 'application/json'
        }
      }) 
      .then((response )=> response.json())
      .then((data) => {
    
    
    
        let resStr = JSON.stringify(data);
        let resJSON = JSON.parse(resStr);
        let responseURL=JSON.parse(resJSON.body).uploadURL;
       // this.confirmMsg("Success", responseURL);
        console.log("Response URL : "+responseURL);
    
      
        this.loader.open();
    
        fetch(responseURL, {
          method: 'PUT',
          mode: 'cors',
          body:  this.selectedFile,
          headers: {
            'content-type': 'video/mp4'
          }
        })
        .then((response )=> response.text())
        .then((data)=>{
          console.log(data)
          //his.loader.close();
          this.onImportComplete(responseURL)
        })
        .catch((error: Error) => {
          this.loader.close();
          console.log(error);
          //this.confirmMsg("Error", error.message);
          this.onImportError(error)
        })
      })
      .catch((error: Error) => {
        console.log(error);
        this.onImportError(error)
      })
    }


    onImportError(res) {
      //this.selectedFile = "";
      this.loader.close();
      this.confirmMsg("Fail", res);
    }
  
    onImportComplete(responseURL) {
      if (responseURL) {
       
  
        this.vForm.value.type ='mp4';
        //this.currentFile.Progress = 100;
        //this.currentFile.Name = "";
      }
  
      var urlParts = responseURL.split('?');
      if (urlParts.length >= 2) {
      var urlBase = urlParts.shift();
      console.log(urlBase);
      this.vForm.value.path = urlBase;
      }
  
      this.vForm.value.courseId = this.courseData._id;
      if (!this.vForm.value.contentId) {
        this.vForm.value.contentId = "";
      }
      if (!this.vForm.value.duration) {
        this.vForm.value.duration = "";
      }
      if (!this.vForm.value._id) {
        this.vForm.value._id = "";
      }
  
      this.api.uploadCourseCont(this.vForm.value).subscribe(
        (res) => {
          this.loader.close();
          this.confirmMsg("Success", "Video details successfully updated !!");
          this.getContent();
          this.onClickCourse(this.courseData);
        },
        (err) => {
          this.loader.close();
          this.confirmMsg("Fail", err.error);
        }
      );
    }
  


  onAddVideoDetails123() {
    console.log("this.vForm.value", this.vForm.value);
    console.log('this.parentIdVideo', this.parentIdVideo);
    console.log('currentFile', this.currentFile);
    if (this.currentFile && this.currentFile.Name) {
      this.loader.open();
      this.currentFile.Progress = 10;
      this.fileRepository.importFile(
        this.parentIdVideo,
        this.currentFile,
        (res) => this.onImportError(res),
        (res) => this.onImportComplete(res),
        (res) => this.onImportProgress(res)
      );
    } else {
      this.onImportComplete("");
    }
  }
 
  onImportProgress(event: any) {
    this.currentFile.Progress = (event.loaded / event.total) * 100;
    this.cdf.detectChanges();
  }
  increase() {
    this.files[0].Progress -= 10;
  }
  // public moreData(data) {
  //   this.updateBar(data["percent"]);
  //   const selectedFiles: Blob = this.selectedFile;
  //   const place = data["place"] * 2097152;
  //   let newFile;
  //   newFile = selectedFiles.slice(
  //     place,
  //     place + Math.min(2097152, selectedFiles.size - place)
  //   );
  //   this.fileReader.readAsBinaryString(newFile);
  // }
  // public updateBar(percent) {
  //   this.vprocess = Math.round(percent * 100) / 100;
  //   this.cdf.detectChanges();
  // }
  confirmMsg(title, msg) {
    this.appear
      .confirm({ title: title, message: msg, button: "close" })
      .subscribe((res) => {});
  }
}
