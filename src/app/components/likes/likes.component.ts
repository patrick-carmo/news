import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  IonHeader,
  IonItem,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonText,
  IonList,
  ModalController,
  IonAvatar,
  IonLabel,
} from '@ionic/angular/standalone';
import { Timestamp } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
import { Likes, News } from 'src/app/interfaces/interfaces';
import { LikesService } from 'src/app/services/storage/news/likes.service';
import { UserPreferencesService } from 'src/app/services/storage/user-preferences.service';
import { formatDate } from 'src/app/utils/formatDate';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonLabel,
    IonAvatar,
    IonList,
    IonText,
    IonContent,
    IonTitle,
    IonButton,
    IonButtons,
    IonToolbar,
    IonItem,
    IonHeader,
  ],
})
export class LikesComponent {
  private modalCtrl = inject(ModalController);
  private likeService = inject(LikesService);
  private userPrefService = inject(UserPreferencesService);

  @Input() news: News = {} as News;
  protected users: Likes[] = [];

  constructor() {}

  async ionViewWillEnter() {
    const data = await firstValueFrom(this.likeService.getLikes(this.news));

    const likes: {
      userId: string;
      date: string;
    }[] = data.map((data) => {
      const date = data['date'] as Timestamp;

      const formattedDate = formatDate(date.toDate());

      return {
        userId: data['userId'],
        date: formattedDate,
      };
    });

    const userIds = likes.map((like) => like.userId);

    if (!userIds.length) {
      return;
    }

    const users = (await firstValueFrom(
      this.userPrefService.getUsers(userIds)
    )) as Likes[];

    const result = users.map((user: Likes) => {
      const like = likes.find(
        (like: Partial<Likes> & { ['userId']: string }) =>
          like.userId === user.uid
      );

      return {
        ...user,
        date: like?.date || '',
      };
    });

    this.users = result;
  }

  dimiss() {
    this.modalCtrl.dismiss();
  }
}
