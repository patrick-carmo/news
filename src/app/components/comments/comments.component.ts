import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonContent,
  IonLabel,
  IonItem,
  IonList,
  IonText,
  IonAvatar,
  IonTitle,
} from '@ionic/angular/standalone';
import { News } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTitle,
    IonAvatar,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    IonContent,
  ],
})
export class CommentsComponent {
  comments = [
    {
      user: 'Patrick',
      date: '2021-09-01',
      comment: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      user: 'John',
      date: '2021-09-02',
      comment: `The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33`,
    },
    {
      user: 'Mary',
      date: '2021-09-03',
      comment: `The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
    },
  ];
  constructor() {}
}
