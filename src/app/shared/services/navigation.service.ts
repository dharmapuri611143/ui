import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  role?: string[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
  role?: string[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  constructor() { }
  iconMenu: IMenuItem[] = [
    {
      name: "HOME",
      type: "link",
      tooltip: "Home",
      icon: 'home',
      state: "home",
      role: ['student']
    },
    {
      name: 'My Profile',
      type: 'link',
      tooltip: 'My Profile',
      icon: 'account_circle',
      state: 'profile/settings',
      role: ['admin', 'super admin']
    },
    // {
    //   name: 'DASHBOARD',
    //   type: 'link',
    //   tooltip: 'DASHBOARD',
    //   icon: 'dashboard',
    //   state: 'student',
    //   role: ['student']
    // },
    {
      name: 'DASHBOARD',
      type: 'link',
      tooltip: 'DASHBOARD',
      icon: 'dashboard',
      state: 'admin',
      role: ['admin', 'super admin']
    },
    {
      name: "CHAT",
      type: "link",
      tooltip: "Chat",
      icon: "chat",
      state: "chat",
      badges: [{ color: "warn", value: "1" }],
      role: ['admin']
    },
    {
      name: 'COURSES',
      type: 'link',
      tooltip: 'COURSES',
      icon: 'library_books',
      state: 'course',
      role: ['student']
    },
    {
      name: 'Current Affair',
      type: 'link',
      tooltip: 'Current Affairs',
      icon: 'question_answer',
      state: 'home/blogl',
      role: ['student']
    },
    {
      name: 'student List',
      type: 'link',
      tooltip: 'student List',
      icon: 'format_list_bulleted',
      state: 'admin/clist',
      role: ['admin', 'super admin']
    },
    {
      name: 'System Configuration',
      type: 'link',
      tooltip: 'System Configuration',
      icon: 'store',
      state: 'admin/config',
      role: ['admin', 'super admin']
    },
    {
      name: 'Inquiry List',
      type: 'link',
      tooltip: 'Inquiry List',
      icon: 'store',
      state: 'admin/inquirylist',
      role: ['admin']
    },
    {
      name: 'Current Affairs',
      type: 'link',
      tooltip: 'System Configuration',
      icon: 'format_list_bulleted',
      state: 'admin/bloglist',
      role: ['admin']
    },
    {
      name: 'Category List',
      type: 'link',
      tooltip: 'Category List',
      icon: 'category',
      state: 'admin/catl',
      role: ['admin']
    },
    {
      name: 'Course List',
      type: 'link',
      tooltip: 'Course List',
      icon: 'library_books',
      state: 'admin/colist',
      role: ['admin']
    },
    {
      name: 'Order List',
      type: 'link',
      tooltip: 'Order List',
      icon: 'storage',
      state: 'admin/orders',
      role: ['super admin']
    },
    {
      name: 'Assessment List',
      type: 'link',
      tooltip: 'Assessment List',
      icon: 'question_answer',
      state: 'admin/aop',
      role: ['admin']
    },
    {
      name: 'Review List',
      type: 'link',
      tooltip: 'Review List',
      icon: 'rate_review',
      state: 'admin/reviews',
      role: ['admin']
    },
    {
      name: 'Blog Review List',
      type: 'link',
      tooltip: 'Blog Review List',
      icon: 'rate_review',
      state: 'admin/breviews',
      role: ['admin']
    },
    {
      name: 'Free Material',
      type: 'link',
      tooltip: 'Free Material',
      icon: 'playlist_add_check',
      state: 'admin/fmat',
      role: ['admin']
    },
    {
      name: 'Career List',
      type: 'link',
      tooltip: 'Career List',
      icon: 'playlist_add_check',
      state: 'admin/careers',
      role: ['admin', 'super admin']
    },
    {
      name: 'Apply for Job',
      type: 'link',
      tooltip: 'Apply for Job',
      icon: 'group',
      state: 'admin/aplyjlist',
      role: ['admin', 'super admin']
    },
    {
      name: 'Course Gallery',
      type: 'link',
      tooltip: 'Course Gallery',
      icon: 'format_list_bulleted',
      state: 'home',
      role: ['student']
    },
    {
      name: 'Hire Talent',
      type: 'link',
      tooltip: 'Hire Talent',
      icon: 'format_list_bulleted',
      state: 'home',
      role: ['student']
    },
    {
      name: 'Current Affairs',
      type: 'link',
      tooltip: 'Current Affairs',
      icon: 'format_list_bulleted',
      state: 'home/blogl',
      role: ['student']
    },
    {
      name: 'Contact Us',
      type: 'link',
      tooltip: 'Contact Us',
      icon: 'format_list_bulleted',
      state: 'home/contactus',
      role: ['student']
    },
    {
      name: 'About Us',
      type: 'link',
      tooltip: 'About Us',
      icon: 'format_list_bulleted',
      state: 'home/aboutus',
      role: ['student']
    },
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    this.menuItems.next(this.iconMenu);
  }
}
